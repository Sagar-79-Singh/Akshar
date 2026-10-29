import {useEffect} from 'react';
export function useEffects(appearance){
  useEffect(()=>{
    const media=window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame=0,lastMouse=null;
    const sync=()=>{
      const off=Boolean(appearance?.reduceEffects)||media.matches;
      document.body.classList.toggle('effects-off',off);
      document.body.classList.toggle('sky-paused',document.hidden);
      if(off||document.hidden){cancelAnimationFrame(frame);frame=0;document.querySelectorAll('.magnetic,.drop,.history-item').forEach(el=>{el.style.transform=''})}
    };
    sync();media.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);
    const move=e=>{
      if(document.hidden||document.body.classList.contains('effects-off'))return;
      lastMouse={x:e.clientX,y:e.clientY,target:e.target.closest?.('.magnetic,.drop,.history-item')};
      if(frame)return;
      frame=requestAnimationFrame(()=>{
        if(!lastMouse)return;
        const {x,y,target}=lastMouse;
        document.documentElement.style.setProperty('--mx',x+'px');document.documentElement.style.setProperty('--my',y+'px');
        if(target){
          const r=target.getBoundingClientRect(),dx=(x-r.left-r.width/2)/(r.width/2),dy=(y-r.top-r.height/2)/(r.height/2);
          target.style.transform=target.classList.contains('magnetic')?`translate(${dx*6}px,${dy*5}px)`:`perspective(700px) rotateX(${-dy*5}deg) rotateY(${dx*5}deg)`;
        }
        frame=0;
      });
    };
    const leave=e=>{const target=e.target.closest?.('.magnetic,.drop,.history-item');if(target&&!target.contains(e.relatedTarget))target.style.transform=''};
    document.addEventListener('mousemove',move,{passive:true});document.addEventListener('mouseout',leave,true);
    return()=>{media.removeEventListener('change',sync);document.removeEventListener('visibilitychange',sync);document.removeEventListener('mousemove',move);document.removeEventListener('mouseout',leave,true);cancelAnimationFrame(frame)};
  },[appearance?.reduceEffects]);
}
