const test=require('node:test');
const assert=require('node:assert/strict');
const {paperPrompt}=require('./paper-prompt.cjs');
test('English body is exact, original-script, and excludes the header',()=>{
  const prompt=paperPrompt({School:'Example School',Class:'10'},'en');
  assert.match(prompt,/English \(Latin script\)/);
  assert.match(prompt,/Never translate or transliterate English into Hindi or Devanagari/);
  assert.match(prompt,/other language in their original script/);
  assert.match(prompt,/Do NOT output a header, school name, address, class, subject, full marks, time or exam title/);
  assert.doesNotMatch(prompt,/Example School|Class: 10/);
});
test('Hindi body is Unicode, original-script, and excludes the header',()=>{
  const prompt=paperPrompt({School:'विद्यालय'},'hi');
  assert.match(prompt,/clean Unicode Devanagari/);
  assert.match(prompt,/other language in their original script/);
  assert.match(prompt,/Output ONLY the body/);
  assert.doesNotMatch(prompt,/विद्यालय:/);
});
test('language must be selected',()=>assert.throws(()=>paperPrompt({},'auto'),/Invalid paper language/));
