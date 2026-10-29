const test=require('node:test');
const assert=require('node:assert/strict');
const {paperPrompt}=require('./paper-prompt.cjs');
const details={School:'Example School',Address:'Main Road',Class:'10',Subject:'Science','Full Marks':'80',Time:'2 Hours','Exam Title':'Annual Exam'};
test('English is explicit, preserves original script, and uses English header labels',()=>{
  const prompt=paperPrompt(details,'en');
  assert.match(prompt,/English \(Latin script\)/);
  assert.match(prompt,/Never translate or transliterate English into Hindi or Devanagari/);
  assert.match(prompt,/other language in their original script/);
  for(const [label,value] of Object.entries(details))assert.ok(prompt.includes(`${label}: ${value}`));
  assert.doesNotMatch(prompt,/विद्यालय:/);
});
test('Hindi uses Unicode Devanagari and Hindi header labels',()=>{
  const prompt=paperPrompt(details,'hi');
  assert.match(prompt,/clean Unicode Devanagari/);
  assert.match(prompt,/other language in their original script/);
  for(const label of ['विद्यालय','पता','कक्षा','विषय','पूर्णांक','समय','परीक्षा का नाम'])assert.ok(prompt.includes(`${label}:`));
  assert.doesNotMatch(prompt,/School: Example School/);
});
test('absent header details are omitted and language must be selected',()=>{
  assert.doesNotMatch(paperPrompt({},'en'),/School:/);
  assert.throws(()=>paperPrompt({},'auto'),/Invalid paper language/);
});
