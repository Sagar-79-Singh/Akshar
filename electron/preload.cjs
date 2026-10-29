const {contextBridge, ipcRenderer} = require('electron');
contextBridge.exposeInMainWorld('akshar', Object.freeze({
  load:()=>ipcRenderer.invoke('load'), saveSettings:(s)=>ipcRenderer.invoke('settings:save',s),
  saveHistory:(h)=>ipcRenderer.invoke('history:save',h), getKeyStatus:()=>ipcRenderer.invoke('key:status'),
  setKey:(key)=>ipcRenderer.invoke('key:set',key), testKey:()=>ipcRenderer.invoke('key:test'),
  transcribe:(images,details,model,language)=>ipcRenderer.invoke('transcribe',images,details,model,language),
  onStatus:(fn)=>{const handler=(_e,status)=>fn(status); ipcRenderer.on('transcribe:status',handler);return ()=>ipcRenderer.removeListener('transcribe:status',handler)},
  saveFile:(name,data,kind,language,details)=>ipcRenderer.invoke('file:save',name,data,kind,language,details),
  exportJson:(name,data)=>ipcRenderer.invoke('json:export',name,data), importJson:()=>ipcRenderer.invoke('json:import')
}));
