// Shared renderer/main-process paper header. No exam title in the Word-style template.
export function buildHeader(details={},language='hi'){
  const labels=language==='en'?{class:'Class:-',marks:'F.M.:-',subject:'Subject:-',time:'Time:-'}:{class:'कक्षा:-',marks:'पूर्णांक:-',subject:'विषय:-',time:'समय:-'};
  const cell=(label,value)=>String(value??'').trim()?{label,value:String(value).trim()}:null;
  return {
    school:String(details.school??'').trim(),address:String(details.address??'').trim(),
    rows:[
      [cell(labels.class,details.class),cell(labels.marks,details.fullMarks)],
      [cell(labels.subject,details.subject),cell(labels.time,details.time)]
    ]
  };
}
const width=70;
const count=s=>Array.from(s).length;
const center=s=>' '.repeat(Math.max(0,Math.floor((width-count(s))/2)))+s;
export function headerText(header){
  const lines=[];
  if(header.school)lines.push(center(header.school));
  if(header.address)for(const line of header.address.split('\n'))lines.push(center(line));
  for(const [left,right] of header.rows){
    const a=left?`${left.label} ${left.value}`:'';
    const b=right?`${right.label} ${right.value}`:'';
    lines.push(b?a+' '.repeat(Math.max(1,width-count(a)-count(b)))+b:a);
  }
  return lines.join('\n').trimEnd();
}
export function paperText(header,body){const heading=headerText(header);return heading?(body?heading+'\n\n'+body:heading):body}
