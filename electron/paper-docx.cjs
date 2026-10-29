const {Document,Paragraph,Packer,TextRun,Table,TableRow,TableCell,WidthType,BorderStyle,AlignmentType}=require('docx');

async function makePaperDocx(header,body,language){
  const font=language==='en'?'Calibri':'Mangal';
  const run=(text,options={})=>new TextRun({text,font,size:24,...options});
  const children=[];
  if(header.school)children.push(new Paragraph({alignment:AlignmentType.CENTER,children:[run(header.school,{bold:true})]}));
  if(header.address)for(const line of header.address.split('\n'))children.push(new Paragraph({alignment:AlignmentType.CENTER,children:[run(line)]}));
  const none={style:BorderStyle.NONE,size:0,color:'FFFFFF'};
  const borders={top:none,bottom:none,left:none,right:none,insideHorizontal:none,insideVertical:none};
  const rows=header.rows.map((pair,rowIndex)=>new TableRow({children:pair.map((cell,colIndex)=>new TableCell({
    width:{size:50,type:WidthType.PERCENTAGE},borders,
    children:[new Paragraph({alignment:colIndex?AlignmentType.RIGHT:AlignmentType.LEFT,
      children:cell?[run(cell.label,{underline:rowIndex===0&&colIndex===0}),run(' '+cell.value)]:[]})]
  }))}));
  if(header.rows.some(row=>row.some(Boolean)))children.push(new Table({width:{size:100,type:WidthType.PERCENTAGE},borders,rows}));
  if(children.length)children.push(new Paragraph({text:''}));
  children.push(...body.split('\n').map(line=>new Paragraph({children:[run(line)]})));
  return Packer.toBuffer(new Document({sections:[{children}]}));
}
module.exports={makePaperDocx};
