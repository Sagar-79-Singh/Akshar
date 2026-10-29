// Kruti Dev 010 table adapted from BharatType hindi-transliteration (MIT, © 2026 BharatType).
// See LICENSE-THIRD-PARTY.md. Ordered longest-first so ligatures precede individual letters.
import table from './krutidev-table.json' with {type:'json'};
const forward = table.filter(([k])=>k).sort((a,b)=>b[0].length-a[0].length);
const special = new Map([['क्ष','{k'],['त्र','='],['ज्ञ','K'],['श्र','J'],['क्र','Ø'],['प्र','iz'],['आ','vk'],['इ','b'],['ई','bZ'],['उ','m'],['ऊ','Å'],['क','d'],['ख','[k'],['ग','x'],['च','p'],['ज','t'],['त','r'],['द','n'],['न','u'],['प','i'],['म','e'],['र','j'],['स','l'],['ह','g'],['श',"'k"],['ा','k'],['ी','h'],['े','s'],['ं','a'],['।','A']]);
const reverseMap=new Map();for(const [k,u] of table){if(u && !reverseMap.has(u) && !/[a-zA-Z]/.test(u))reverseMap.set(u,k)}for(const [u,k] of special)reverseMap.set(u,k);
const reverse=[...reverseMap].sort((a,b)=>b[0].length-a[0].length);
function replaceMapped(text,mapping){let out='';for(let i=0;i<text.length;){const pair=mapping.find(([key])=>text.startsWith(key,i));if(pair){out+=pair[1];i+=pair[0].length}else out+=text[i++]}return out}
export function krutiToUnicode(input=''){
  let text=String(input).replace(/±/g,'Zं').replace(/Æ/g,'र्f').replace(/Ç/g,'fa').replace(/É/g,'र्fa').replace(/Ê/g,'ीZ');
  // Protect short-i as a private marker until after the character table runs.
  text=text.replace(/f/g,'\uE000');
  text=replaceMapped(text,forward);
  text=text.replace(/\uE000((?:[क-हक़-य़]्)*[क-हक़-य़])/g,'$1ि').replace(/\uE000/g,'ि');
  text=text.replace(/fa/g,'िं');
  // Reph is typed after the syllable in Kruti Dev.
  text=text.replace(/((?:[क-हक़-य़]्)*[क-हक़-य़][ािीुूृेैोौंँः]*)Z/g,'र्$1').replace(/Z/g,'');
  return text.normalize('NFC');
}
export function unicodeToKruti(input=''){
  let text=String(input).normalize('NFC');
  // Encode reph as a suffix after the whole syllable.
  text=text.replace(/र्((?:[क-हक़-य़]्)*[क-हक़-य़][ािीुूृेैोौंँः]*)/g,'$1\uE001');
  // Pre-base i moves before the cluster, rather than just the final consonant.
  text=text.replace(/((?:[क-हक़-य़]्)*[क-हक़-य़])ि/g,'\uE000$1');
  text=replaceMapped(text,reverse);
  return text.replace(/\uE000/g,'f').replace(/\uE001/g,'Z');
}
