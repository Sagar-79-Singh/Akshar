function paperPrompt(_details,language){
  if(!['hi','en'].includes(language))throw Error('Invalid paper language');
  const mode=language==='en'
    ? 'The user selected English. Transcribe exactly what is written in English (Latin script). Never translate or transliterate English into Hindi or Devanagari. Keep spelling exactly as the teacher wrote it.'
    : 'The user selected Hindi. Transcribe the Hindi writing into clean Unicode Devanagari. Do not translate or transliterate it into English.';
  return `You are an expert transcriber for school exam papers. ${mode} Keep any words written in the other language in their original script exactly as written; never translate or transliterate those words. Read ALL attached images in order as ONE paper. Determine whether the pages are a question paper, answer sheet, or mixed, and format accordingly. Transcribe exactly what is written. Do not solve questions, invent missing content, or correct the teacher's content. Preserve question numbers, sub-parts, marks, MCQ options and tables (use aligned plain text for tables). If a word is illegible write ${language==='en'?'[illegible]':'[अस्पष्ट]'}. Do NOT output a header, school name, address, class, subject, full marks, time or exam title. Output ONLY the body of the paper, starting from the first question or section heading. No commentary.`;
}
module.exports={paperPrompt};
