const {app,BrowserWindow,ipcMain,dialog,safeStorage,nativeTheme} = require('electron');
const {join} = require('path');
const fs = require('fs/promises');
const {autoUpdater} = require('electron-updater');
const {paperPrompt} = require('./paper-prompt.cjs');
let win; let queue = Promise.resolve(); let nextRequest = 0;
const defaults = () => ({schools:[],lists:{class:['6','7','8','9','10','11','12'],subject:[],fullMarks:['20','30','40','50','80','100'],time:['1 Hour','1.5 Hours','2 Hours','3 Hours'],examTitle:['Unit Test','Half Yearly','Annual Exam','Pre-Board']},appearance:{theme:'system',sky:'day',reduceEffects:false,accent:'#52D98A',uiSize:'M',hindiSize:18,density:'comfortable',sidebar:true},lastSelection:{language:'hi'},model:'auto'});
const dataFile = (name)=>join(app.getPath('userData'),name);
async function readJson(name,fallback){try{return JSON.parse(await fs.readFile(dataFile(name),'utf8'))}catch{return fallback}}
async function writeJson(name,data){const file=dataFile(name);await fs.mkdir(app.getPath('userData'),{recursive:true});const temp=file+'.tmp';await fs.writeFile(temp,JSON.stringify(data,null,2),'utf8');await fs.rename(temp,file)}
async function getKey(){try {const raw=await fs.readFile(dataFile('key.bin'));if(!safeStorage.isEncryptionAvailable())throw Error('Secure storage is unavailable on this system. Enable your OS keyring.');return safeStorage.decryptString(raw)}catch(e){if(e.code==='ENOENT')return '';throw e}}
const models=['gemini-2.5-flash','gemini-2.5-flash-lite','gemini-3.1-flash-lite'];
function createWindow(){win=new BrowserWindow({title:'Akshar',width:1350,height:850,minWidth:900,minHeight:600,backgroundColor:'#07160F',icon:join(__dirname,'../build/icon.png'),webPreferences:{preload:join(__dirname,'preload.cjs'),contextIsolation:true,nodeIntegration:false,sandbox:true}});win.setMenuBarVisibility(false);if(!app.isPackaged)win.loadURL('http://localhost:5173');else win.loadFile(join(__dirname,'../dist/index.html'));}
app.whenReady().then(()=>{createWindow();if(app.isPackaged){autoUpdater.autoDownload=true;autoUpdater.checkForUpdatesAndNotify().catch(()=>{})}app.on('activate',()=>{if(!BrowserWindow.getAllWindows().length)createWindow()})});
app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit()});
ipcMain.handle('load',async()=>({settings:await readJson('settings.json',defaults()),history:await readJson('history.json',[])}));
ipcMain.handle('settings:save',async(_e,s)=>{if(!s||!Array.isArray(s.schools)||!s.lists||!s.appearance)throw Error('Invalid settings');const {apiKey,...clean}=s;await writeJson('settings.json',clean);return true});
ipcMain.handle('history:save',async(_e,h)=>{if(!Array.isArray(h))throw Error('Invalid history');await writeJson('history.json',h.slice(0,50));return true});
ipcMain.handle('key:status',async()=>Boolean(await getKey()));
ipcMain.handle('key:set',async(_e,key)=>{if(typeof key!=='string'||key.length>512)throw Error('Invalid key');if(!key.trim()){await fs.rm(dataFile('key.bin'),{force:true});return false}if(!safeStorage.isEncryptionAvailable())throw Error('Secure storage is unavailable. Set up your OS keyring first.');await fs.mkdir(app.getPath('userData'),{recursive:true});await fs.writeFile(dataFile('key.bin'),safeStorage.encryptString(key.trim()));return true});
async function gemini(model,key,parts){const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),120000);try{const response=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,{method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':key},body:JSON.stringify({contents:[{parts}],generationConfig:{temperature:0.1}}),signal:controller.signal});const body=await response.json();if(!response.ok){const err=new Error(body.error?.message||`Gemini HTTP ${response.status}`);err.status=response.status;throw err}const text=body.candidates?.[0]?.content?.parts?.map(p=>p.text||'').join('\n').trim();if(!text)throw Error('No text returned. The image may have been blocked or unreadable.');return text}finally{clearTimeout(timer)}}
async function runTranscription(images,details,choice,language){const key=await getKey();if(!key)throw Error('Add API key in Settings');if(!Array.isArray(images)||!images.length||images.length>30)throw Error('Select 1–30 images');if(images.some(i=>!/^data:image\/(jpeg|png|webp);base64,/.test(i)||i.length>14000000))throw Error('Invalid or oversized image');const prompt=paperPrompt(details,language);
const parts=[{text:prompt},...images.map(i=>{const [,mime,data]=i.match(/^data:(image\/(?:jpeg|png|webp));base64,(.*)$/s)||[];return {inline_data:{mime_type:mime,data}}})];
const chain=choice==='auto'?models:[choice];if(chain.some(m=>!models.includes(m)))throw Error('Invalid model');
for(let m=0;m<chain.length;m++){for(let attempt=0;attempt<3;attempt++){const model=chain[m];const wait=Math.max(0,nextRequest-Date.now());if(wait)await new Promise(r=>setTimeout(r,wait));nextRequest=Date.now()+6500;win?.webContents.send('transcribe:status',`${model}${attempt?' · retrying after rate limit':''}`);try{return await gemini(model,key,parts)}catch(e){if(![429,503].includes(e.status)&&!(/quota|resource exhausted/i.test(e.message)))throw e;win?.webContents.send('transcribe:status',`${model} · ${e.message.slice(0,100)} · retrying`);if(attempt<2)await new Promise(r=>setTimeout(r,Math.min(2000*2**attempt,8000)))}}}throw Error('All available models are busy or out of quota. Try again later.')}
ipcMain.handle('transcribe',(_e,images,details,model,language)=>{const task=queue.then(()=>runTranscription(images,details,model,language));queue=task.catch(()=>{});return task});
ipcMain.handle('key:test',()=>{const task=queue.then(async()=>{const key=await getKey();if(!key)throw Error('Save a key first');const wait=Math.max(0,nextRequest-Date.now());if(wait)await new Promise(r=>setTimeout(r,wait));nextRequest=Date.now()+6500;await gemini('gemini-2.5-flash-lite',key,[{text:'Reply with OK only.'}]);return true});queue=task.catch(()=>{});return task});
ipcMain.handle('file:save',async(_e,name,data,kind,language,details)=>{
  if(!['txt','docx'].includes(kind)||typeof data!=='string'||!['hi','en'].includes(language))throw Error('Invalid file');
  const safeName=String(name).replace(/[^\p{L}\p{N} _-]/gu,'').slice(0,70)||'Akshar';
  const {filePath,canceled}=await dialog.showSaveDialog(win,{defaultPath:`${safeName}.${kind}`,filters:[{name:kind.toUpperCase(),extensions:[kind]}]});
  if(canceled)return false;
  const {buildHeader,paperText}=await import('./paper-header.mjs');
  const header=buildHeader(details,language);
  if(kind==='txt')await fs.writeFile(filePath,paperText(header,data),'utf8');
  else await fs.writeFile(filePath,await require('./paper-docx.cjs').makePaperDocx(header,data,language));
  return true;
});
ipcMain.handle('json:export',async(_e,name,data)=>{const {filePath,canceled}=await dialog.showSaveDialog(win,{defaultPath:name,filters:[{name:'JSON',extensions:['json']}]});if(canceled)return false;await fs.writeFile(filePath,JSON.stringify(data,null,2));return true});
ipcMain.handle('json:import',async()=>{const {filePaths,canceled}=await dialog.showOpenDialog(win,{properties:['openFile'],filters:[{name:'JSON',extensions:['json']}]});if(canceled)return null;const stat=await fs.stat(filePaths[0]);if(stat.size>2e6)throw Error('JSON file is too large');return JSON.parse(await fs.readFile(filePaths[0],'utf8'))});
