import React from 'react';
import Dropdown from './Dropdown.jsx';
const fields=[['class','Class'],['subject','Subject'],['fullMarks','Full Marks'],['time','Time'],['examTitle','Exam Title']];
export default function PaperDetails({settings,selection,update}){
  const school=settings.schools.find(s=>s.id===selection.schoolId);
  return <section className="card paper-details"><div className="section-head"><h2>Paper details</h2><span className="muted">Optional</span></div>
    <div className="paper-language"><span>Paper language</span><div className="language-toggle" role="group" aria-label="Paper language"><button type="button" aria-pressed={(selection.language||'hi')==='hi'} onClick={()=>update('language','hi')}>Hindi</button><button type="button" aria-pressed={selection.language==='en'} onClick={()=>update('language','en')}>English</button></div></div>
    <div className="fields"><div className="wide"><Dropdown label="School" value={school?.name||selection.schoolCustom||''} options={settings.schools.filter(s=>s.name).map(s=>({id:s.id,label:s.name,description:s.address}))} placeholder={settings.schools.length?'Select or type':'Add schools in Settings or type'} onChange={v=>{update('schoolId','');update('schoolCustom',v)}} onSelect={o=>{update('schoolId',o.id);update('schoolCustom','')}}/></div>
      {fields.map(([key,label])=><Dropdown key={key} label={label} value={selection[key]||''} options={(settings.lists[key]||[]).filter(Boolean).map(item=>({label:item}))} onChange={v=>update(key,v)} onSelect={o=>update(key,o.label)}/>)}
    </div>
  </section>
}
