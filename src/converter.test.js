import test from 'node:test';import assert from 'node:assert/strict';import {krutiToUnicode,unicodeToKruti} from './converter.js';
const pairs=[['d','क'],['dk','का'],['fd','कि'],['fdrkc','किताब'],['Hkkjr','भारत'],['jke','राम'],['ueLrs','नमस्ते'],['v','अ'],['vk','आ'],['b','इ'],['m','उ'],['Å','ऊ'],['[k','ख'],['x','ग'],['p','च'],['t','ज'],['r','त'],['n','द'],['u','न'],['i','प'],['e','म'],['j','र'],['l','स'],['g','ह'],["'k",'श'],['{k','क्ष'],['K','ज्ञ'],['J','श्र'],['iz','प्र'],['dZ','र्क']];
for(const [legacy,unicode]of pairs)test(`Kruti Dev ${legacy} ↔ ${unicode}`,()=>{assert.equal(krutiToUnicode(legacy),unicode);assert.equal(unicodeToKruti(unicode),legacy)});
test('preserves punctuation and multiline text',()=>assert.equal(krutiToUnicode('jke\nHkkjr'), 'राम\nभारत'));
test('round trip connected words',()=>{for(const word of ['किताब','भारत','नमस्ते','राम','प्रश्न'])assert.equal(krutiToUnicode(unicodeToKruti(word)),word)});

test('exam terminology and complex conjuncts round trip',()=>{for(const word of ['हिन्दी','हिंदी','विद्यालय','प्रश्न','अध्यापक','शिक्षा','परीक्षा','कक्षा','विषय','समय','पूर्णांक','निर्देश','उत्तर','वार्षिक','प्रार्थना','कर्म','धर्म','कृष्ण','राष्ट्रीय'])assert.equal(krutiToUnicode(unicodeToKruti(word)),word)});
