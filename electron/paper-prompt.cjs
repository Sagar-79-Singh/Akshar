const headerLabels = {
  en: {School:'School', Address:'Address', Class:'Class', Subject:'Subject', 'Full Marks':'Full Marks', Time:'Time', 'Exam Title':'Exam Title'},
  hi: {School:'विद्यालय', Address:'पता', Class:'कक्षा', Subject:'विषय', 'Full Marks':'पूर्णांक', Time:'समय', 'Exam Title':'परीक्षा का नाम'}
};

function paperPrompt(details,language){
  if(!['hi','en'].includes(language))throw Error('Invalid paper language');
  const header=Object.entries(headerLabels[language]).filter(([key])=>typeof details?.[key]==='string'&&details[key].trim()).map(([key,label])=>`${label}: ${details[key].trim()}`).join('\n');
  const mode=language==='en'
    ? 'The user selected English. Transcribe exactly what is written in English (Latin script). Never translate or transliterate English into Hindi or Devanagari. Keep spelling exactly as the teacher wrote it.'
    : 'The user selected Hindi. Transcribe the Hindi writing into clean Unicode Devanagari. Do not translate or transliterate it into English.';
  return `You are an expert transcriber for school exam papers. ${mode} Keep any words written in the other language in their original script exactly as written; never translate or transliterate those words. Read ALL attached images in order as ONE paper. Determine whether the pages are a question paper, answer sheet, or mixed, and format accordingly. Transcribe exactly what is written. Do not solve questions, invent missing content, or correct the teacher's content. Preserve headings, question numbers, sub-parts, marks, MCQ options and tables (use aligned plain text for tables). If a word is illegible write ${language==='en'?'[illegible]':'[अस्पष्ट]'}. Use these header details only if supplied, and omit absent fields; do not duplicate an existing header:\n${header}\nOutput ONLY the complete formatted paper text, no commentary.`;
}
module.exports={paperPrompt};
