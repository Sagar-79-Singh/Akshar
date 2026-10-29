import React from 'react';
// Deterministic positions: generated once, no render loop or rerandomization.
const random=(i)=>{let n=Math.sin(i*127.1+78.233)*43758.5453;return n-Math.floor(n)};
const clouds=Array.from({length:7},(_,i)=>({width:80+random(i+1)*140,top:5+random(i+11)*30,duration:30+random(i+21)*40,delay:-random(i+31)*65}));
const stars=Array.from({length:60},(_,i)=>({left:random(i+51)*100,top:random(i+131)*60,delay:random(i+251)*3.4}));
const particles=Array.from({length:26},(_,i)=>({left:random(i+301)*100,delay:-random(i+361)*18,duration:12+random(i+411)*15}));
export default function Sky(){return <><div id="sky" aria-hidden="true"><div id="sky-gradient"/>{clouds.map((c,i)=><span key={'c'+i} className="cloud" style={{width:c.width,height:c.width*.38,top:c.top+'vh',animationDuration:c.duration+'s',animationDelay:c.delay+'s'}}/>)}{stars.map((s,i)=><span key={'s'+i} className="star" style={{left:s.left+'%',top:s.top+'vh',animationDelay:s.delay+'s'}}/>)}{particles.map((p,i)=><span key={'p'+i} className="particle" style={{left:p.left+'%',animationDelay:p.delay+'s',animationDuration:p.duration+'s'}}/>)}<div id="celestial"/></div><div id="spotlight" aria-hidden="true"/><div id="grain" aria-hidden="true"/></>}
