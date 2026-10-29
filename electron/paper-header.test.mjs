import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {buildHeader,headerText,paperText} from './paper-header.mjs';
const require=createRequire(import.meta.url);
const {makePaperDocx}=require('./paper-docx.cjs');
const {unzipSync}=require('fflate'); // transitive of the existing pure-JS docx package
const details={school:'M. M. Mahato Public School',address:'Alkusha, Chas, Bokaro',class:'4',fullMarks:'40',subject:'Science',time:'1½ Hours',examTitle:'Annual Exam'};
const xml=async(header,body,language)=>Buffer.from(unzipSync(await makePaperDocx(header,body,language))['word/document.xml']).toString();
test('70-char English header is centered and right-aligned, title excluded',()=>{
  const lines=headerText(buildHeader(details,'en')).split('\n');
  assert.equal(lines.length,4);
  assert.equal(lines[0].trim(),'M. M. Mahato Public School');
  assert.equal(lines[1].trim(),'Alkusha, Chas, Bokaro');
  assert.equal(lines[2].length,70);assert.equal(lines[3].length,70);
  assert.match(lines[2],/^Class:- 4 +F\.M\.:- 40$/);
  assert.match(lines[3],/^Subject:- Science +Time:- 1½ Hours$/);
  assert.doesNotMatch(lines.join(' '),/Annual Exam/);
  assert.equal(paperText(buildHeader(details,'en'),'A. Choose').split('\n\n')[1],'A. Choose');
});
test('Hindi labels and empty cells do not shift other cells',()=>{
  const lines=headerText(buildHeader({class:'10',time:'2 घंटे'},'hi')).split('\n');
  assert.equal(lines.length,2);
  assert.equal(lines[0],'कक्षा:- 10');
  assert.match(lines[1],/^ +समय:- 2 घंटे$/);
  assert.equal(lines[1].length,70);
  assert.equal(paperText(buildHeader({},'hi'),'Question 1'),'Question 1');
});
test('DOCX has centered school, borderless two-column table, underlined Class label and Calibri',async()=>{
  const content=await xml(buildHeader(details,'en'),'A. Choose','en');
  assert.match(content,/M\. M\. Mahato Public School/);
  assert.match(content,/w:jc w:val="center"/);
  assert.match(content,/w:tbl/);
  assert.match(content,/w:jc w:val="right"/);
  assert.match(content,/w:val="none"/);
  assert.match(content,/w:u w:val="single"/);
  assert.match(content,/Calibri/);
  assert.match(content,/A\. Choose/);
  assert.doesNotMatch(content,/Annual Exam/);
});
test('Hindi DOCX uses Mangal and Hindi labels',async()=>{
  const content=await xml(buildHeader({school:'विद्यालय',class:'4',fullMarks:'40'},'hi'),'प्रश्न १','hi');
  assert.match(content,/Mangal/);assert.match(content,/कक्षा:-/);assert.match(content,/पूर्णांक:-/);
});
test('address lines stay centered and missing school rows are skipped',()=>{
  const multi=headerText(buildHeader({school:'School',address:'Road 1\nBokaro',class:'5'},'en')).split('\n');
  assert.equal(multi.length,4);
  assert.equal(multi[1].trim(),'Road 1');assert.equal(multi[2].trim(),'Bokaro');
  const noSchool=headerText(buildHeader({class:'5'},'en')).split('\n');
  assert.equal(noSchool.length,1);assert.equal(noSchool[0],'Class:- 5');
});
