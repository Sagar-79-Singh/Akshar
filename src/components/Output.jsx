import React from 'react';
import {unicodeToKruti} from '../converter.js';
import {buildHeader,paperText} from '../../electron/paper-header.mjs';

export default function Output({text,setText,title,language,details,notify}){
  const header=buildHeader(details,language);
  const fullText=paperText(header,text);
  async function copy(value){try{await navigator.clipboard.writeText(value);notify('Copied to clipboard')}catch{notify('Clipboard unavailable')}}
  async function save(kind){try{if(await window.akshar.saveFile(title||'Akshar',text,kind,language,details))notify('File saved')}catch(e){notify(e.message)}}
  const hasHeader=Boolean(header.school||header.address||header.rows.some(row=>row.some(Boolean)));
  return <section className="output card"><div className="section-head"><h2>Output</h2><span className="muted">Editable {language==='en'?'English':'Unicode Hindi'}</span></div>
    {hasHeader&&<div className={'paper-header '+(language==='hi'?'hindi':'english')} aria-label="Paper header">
      {header.school&&<div className="paper-school">{header.school}</div>}
      {header.address&&<div className="paper-address">{header.address}</div>}
      {header.rows.map((row,i)=><div className="paper-row" key={i}><div className="paper-cell">{row[0]&&<><span className={i===0?'underlined':''}>{row[0].label}</span> {row[0].value}</>}</div><div className="paper-cell paper-right">{row[1]&&<>{row[1].label} {row[1].value}</>}</div></div>)}
    </div>}
    <textarea className={(language==='en'?'english':'hindi')+' output-text'} value={text} onChange={e=>setText(e.target.value)} placeholder="Your transcribed paper will appear here." spellCheck="false"/>
    <div className="output-actions"><button className="magnetic" disabled={!fullText} onClick={()=>copy(fullText)}>Copy</button>{language!=='en'&&<button className="magnetic" disabled={!fullText} onClick={()=>copy(unicodeToKruti(fullText))}>Copy as Kruti Dev</button>}<span className="grow"/><button className="magnetic" disabled={!fullText} onClick={()=>save('txt')}>Save .txt</button><button className="magnetic" disabled={!fullText} onClick={()=>save('docx')}>Save .docx</button></div>
  </section>
}
