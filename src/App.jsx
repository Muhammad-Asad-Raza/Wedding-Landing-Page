import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars } from '@react-three/drei';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';

// ══════════════════════════════════════════════════════════════════════════
// 🎊  WEDDING DATA
// ══════════════════════════════════════════════════════════════════════════
const W = {
  bride:'Aqsa Kanwal', groom:'Huzaifa Khan',
  date: new Date('2026-12-15T18:00:00'),
  hashtag:'#AqsaHuzaifaForever',
  events:[
    { id:1,icon:'🌸',accent:'#FF9EBC',name:'Mehndi Night',    day:'Saturday', date:'December 12, 2026',time:'07:00 PM — Late Night',venue:'The Pearl Garden, Gulshan-e-Iqbal',city:'Karachi',dress:'Traditional Colorful',desc:'An enchanting evening of mehndi, music and joy.' },
    { id:2,icon:'💒',accent:'#D4AF37',name:'Barat Ceremony',   day:'Tuesday',  date:'December 15, 2026',time:'06:00 PM — Midnight',   venue:'Grand Royale Banquet Hall, DHA',   city:'Karachi',dress:'Formal / Sherwani',  desc:'The most cherished night — where two souls become one family.' },
    { id:3,icon:'✨',accent:'#C084FC',name:'Valima Reception', day:'Thursday', date:'December 17, 2026',time:'07:30 PM — Late Night',venue:'Serena Hotel Ballroom, Clifton',  city:'Karachi',dress:'Formal / Elegant',    desc:'A grand reception celebrating the blessed union.' },
  ],
  timeline:[
    { year:'2021',icon:'⭐',title:'Destined Paths',  desc:'Two families from the same neighbourhood — a connection written in the stars long before either knew.' },
    { year:'2022',icon:'🌷',title:'First Meeting',   desc:'A family gathering brought them face to face for the very first time. A single glance was all it took.' },
    { year:'2023',icon:'💌',title:'Getting to Know', desc:'Shared conversations, family dinners, and the slow beautiful realisation that this was something rare.' },
    { year:'2024',icon:'💍',title:'The Promise',     desc:'Huzaifa asked. Aqsa smiled. Two families united with joy, prayers, and tears of happiness.' },
    { year:'2025',icon:'📅',title:'Planning Forever',desc:'A year of dreams, decisions, and counting down to the most beautiful chapter yet to begin.' },
    { year:'2026',icon:'🕊️',title:'Forever Begins', desc:'December 15th, 2026 — the day two hearts officially become one eternal story.' },
  ],
  gallery:[
    { id:1,span:2,label:'First Look',  sub:'The moment we\'ve always dreamed of',g:'linear-gradient(135deg,#FF9EBC,#FFCCE0)' },
    { id:2,span:1,label:'The Ring',    sub:'A symbol of forever',                 g:'linear-gradient(135deg,#D4AF37,#F0D060)' },
    { id:3,span:1,label:'Our Promise', sub:'Written in the stars',                g:'linear-gradient(135deg,#C084FC,#E9D5FF)' },
    { id:4,span:1,label:'Together',    sub:'Two hearts, one journey',             g:'linear-gradient(135deg,#FF9EBC,#C084FC)' },
    { id:5,span:1,label:'Joy',         sub:'Smiles that light up the room',       g:'linear-gradient(135deg,#D4AF37,#FF9EBC)' },
    { id:6,span:2,label:'Our Moment',  sub:'A love story worth celebrating',      g:'linear-gradient(135deg,#6366F1,#C084FC,#FF9EBC)' },
  ],
  blessings:[
    { a:'A',name:'Ammi & Abu',   rel:'Parents of the Bride',  msg:'Our Aqsa, you are our greatest blessing. May Allah fill your new home with endless love, laughter, and barakah. We are so proud of you. 💕' },
    { a:'N',name:'Nana Jaan',    rel:'Maternal Grandfather',  msg:'Beta, seeing you both today, my heart overflows with gratitude. May Allah keep you united in this dunya and akhirah. Meri dua hamesha tumhare sath hai.' },
    { a:'H',name:'Hamza Bhai',   rel:'Brother of the Bride',  msg:'My little sis getting married feels unreal. Huzaifa bhai, you better take care of her! 😄 Wishing you both a life full of adventures!' },
    { a:'S',name:'Sana Apa',     rel:'Cousin Sister',         msg:'Aqsa, from childhood sleepovers to this magical day — what a journey! You deserve every bit of happiness. We love you endlessly! 🌸' },
    { a:'D',name:'Dadi Amma',    rel:'Paternal Grandmother',  msg:'Mere bachon, Allah tumhare ghar ko jannat ka ek tukra bana de. Yeh budhi aankhein aaj bahut khush hain. Tumhein mera pyar mubarak ho.' },
    { a:'F',name:'Faisal Uncle', rel:'Uncle of the Groom',    msg:'Huzaifa, you have chosen wisely. Aqsa is a gem, and together you will build something beautiful. Congratulations! 🎊' },
  ],
  rsvp:{ submit:(d)=>{ console.log('💌 RSVP:',d); return Promise.resolve({ok:true}); } },
};

// ══════════════════════════════════════════════════════════════════════════
// 📱  MOBILE DETECT
// ══════════════════════════════════════════════════════════════════════════
const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 768;

// ══════════════════════════════════════════════════════════════════════════
// 🎨  GLOBAL CSS  — Mobile-first
// ══════════════════════════════════════════════════════════════════════════
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap');

*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent}

:root{
  --G:#D4AF37;--G2:#E8CC6A;
  --C:#FDF8EC;--D:#110904;--D2:#1D1008;
  --GL:rgba(253,248,236,.05);--GB:rgba(212,175,55,.18);
  --M:rgba(253,248,236,.56);
  --BNH:65px; /* bottom nav height */
  --SAT:env(safe-area-inset-top,0px);
  --SAB:env(safe-area-inset-bottom,0px);
}

html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
body{
  font-family:'Jost',sans-serif;background:var(--D);color:var(--C);
  overflow-x:hidden;overscroll-behavior-y:contain;
  -webkit-font-smoothing:antialiased;
}
.serif{font-family:'Cormorant Garamond',serif}
::-webkit-scrollbar{width:2px}
::-webkit-scrollbar-thumb{background:var(--G);border-radius:2px}

/* ── Envelope ── */
@keyframes envL{to{transform:translateX(-102%)}}
@keyframes envR{to{transform:translateX(102%)}}
@keyframes sealOut{to{opacity:0;transform:translate(-50%,-50%) scale(1.6)}}
.env-l{animation:envL 1.3s cubic-bezier(.77,0,.18,1) forwards}
.env-r{animation:envR 1.3s cubic-bezier(.77,0,.18,1) forwards}
.seal-fade{animation:sealOut .6s ease-out forwards}
@keyframes sealPulse{0%,100%{box-shadow:0 0 0 0 rgba(212,175,55,.5),0 0 30px rgba(212,175,55,.2)}50%{box-shadow:0 0 0 22px rgba(212,175,55,0),0 0 55px rgba(212,175,55,.5)}}
.seal-pulse{animation:sealPulse 2.8s ease-in-out infinite}

/* ── Aurora ── */
@keyframes auroraA{0%,100%{transform:translate(0,0) scale(1)}40%{transform:translate(40px,-30px) scale(1.1)}70%{transform:translate(-25px,30px) scale(.9)}}
@keyframes auroraB{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-30px,20px) scale(1.08)}}
@keyframes auroraC{0%,100%{transform:translate(0,0) scale(1)}60%{transform:translate(25px,20px) scale(1.1)}}

/* ── Petal ── */
@keyframes petal{0%{transform:translateY(-30px) translateX(0) rotate(0deg);opacity:0}8%{opacity:.55}88%{opacity:.38}100%{transform:translateY(110vh) translateX(var(--dx,60px)) rotate(520deg);opacity:0}}

/* ── Shimmer ── */
@keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}

/* ── Float ── */
@keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}

/* ── Tap pulse ── */
@keyframes tapPulse{0%{transform:scale(1)}50%{transform:scale(.96)}100%{transform:scale(1)}}

/* ── Linen ── */
.env-linen{
  background-color:#FBF4E4;
  background-image:repeating-linear-gradient(45deg,rgba(212,175,55,.07) 0,rgba(212,175,55,.07) 1px,transparent 1px,transparent 16px),repeating-linear-gradient(-45deg,rgba(212,175,55,.07) 0,rgba(212,175,55,.07) 1px,transparent 1px,transparent 16px);
}

/* ── Glass card ── */
.gc{background:var(--GL);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border:1px solid var(--GB);border-radius:20px}

/* ── Input ── */
.pin{width:100%;background:rgba(253,248,236,.04);border:1px solid rgba(212,175,55,.2);border-radius:14px;padding:14px 18px;color:var(--C);font-family:'Jost',sans-serif;font-size:16px;outline:none;transition:border-color .3s,background .3s;-webkit-appearance:none}
.pin:focus{border-color:rgba(212,175,55,.55);background:rgba(212,175,55,.06)}
.pin::placeholder{color:rgba(253,248,236,.3)}
option{background:#1D1008;color:#FDF8EC}

/* ── Section base ── */
.section{
  min-height:100vh;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  padding:5rem 1.5rem 7rem;
  position:relative;z-index:1;
}

/* ── Bottom-nav safe area padding ── */
.has-bottom-nav .section{padding-bottom:calc(var(--BNH) + var(--SAB) + 2rem)}

/* ── Bottom Navigation Bar ── */
.bottom-nav{
  display:none;
  position:fixed;bottom:0;left:0;right:0;
  height:calc(var(--BNH) + var(--SAB));
  padding-bottom:var(--SAB);
  background:rgba(14,7,2,.92);
  backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);
  border-top:1px solid rgba(212,175,55,.14);
  z-index:700;
  align-items:stretch;
}

/* ── Top status bar padding (notch) ── */
.top-safe{padding-top:max(var(--SAT), 12px)}

/* ══ RESPONSIVE BREAKPOINTS ══ */

/* Tablet */
@media(max-width:900px){
  .events-grid{grid-template-columns:1fr!important}
  .bless-grid{grid-template-columns:1fr 1fr!important}
}

/* Mobile */
@media(max-width:768px){
  .bottom-nav{display:flex}
  .side-nav-wrap{display:none!important}
  .progress-bar{display:none}

  .section{padding:4rem 1.25rem calc(var(--BNH) + var(--SAB) + 2rem)}

  /* Timeline — left-rail on mobile */
  .tl-wrap{padding-left:30px}
  .tl-rail{left:0!important}
  .tl-item{justify-content:flex-start!important;margin-bottom:2rem!important}
  .tl-content{width:100%!important;text-align:left!important}
  .tl-dot{left:-6px!important;top:1.8rem!important;transform:none!important}
  .tl-year-badge{left:14px!important;top:0!important;transform:none!important}

  /* Gallery */
  .gallery-grid{grid-template-columns:1fr 1fr!important;grid-auto-rows:140px!important}
  .gal-span{grid-column:span 1!important}

  /* Events */
  .events-grid{grid-template-columns:1fr!important}

  /* Blessings */
  .bless-grid{grid-template-columns:1fr!important}

  /* RSVP */
  .rsvp-2col{grid-template-columns:1fr!important}
  .rsvp-attend{flex-direction:column!important}

  /* Hero countdown */
  .cd-row{gap:.6rem!important}
  .cd-box{min-width:72px!important;padding:1rem .7rem!important}
  .cd-num{font-size:2rem!important}

  /* Font scaling */
  .hero-name{font-size:clamp(3.5rem,15vw,5.5rem)!important}
  .sec-title{font-size:clamp(2rem,7vw,3rem)!important}
}

/* Small mobile */
@media(max-width:400px){
  .hero-name{font-size:clamp(3rem,14vw,4.5rem)!important}
  .gallery-grid{grid-template-columns:1fr!important}
  .bless-grid{grid-template-columns:1fr!important}
  .cd-box{min-width:62px!important;padding:.8rem .5rem!important}
  .cd-num{font-size:1.7rem!important}
  .section{padding-left:1rem;padding-right:1rem}
}
`;

// ══════════════════════════════════════════════════════════════════════════
// 🌌  3D SCENE  (reduced on mobile for perf)
// ══════════════════════════════════════════════════════════════════════════
function GoldenDust() {
  const ref  = useRef();
  const mobile = isMobile();
  const count = mobile ? 800 : 2000;
  const { pos, col } = useMemo(() => {
    const pos = new Float32Array(count*3), col = new Float32Array(count*3);
    const pal = [[.83,.69,.22],[.91,.8,.42],[.96,.87,.7],[.95,.8,.8],[1,.96,.86]];
    for (let i=0;i<count;i++){
      pos[i*3]=(Math.random()-.5)*28;pos[i*3+1]=(Math.random()-.5)*28;pos[i*3+2]=(Math.random()-.5)*16;
      const c=pal[Math.floor(Math.random()*pal.length)];col[i*3]=c[0];col[i*3+1]=c[1];col[i*3+2]=c[2];
    }
    return {pos,col};
  },[count]);
  useFrame(s=>{if(!ref.current)return;ref.current.rotation.y=s.clock.elapsedTime*.015;ref.current.rotation.x=Math.sin(s.clock.elapsedTime*.008)*.05;});
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos,3]}/>
        <bufferAttribute attach="attributes-color"    args={[col,3]}/>
      </bufferGeometry>
      <pointsMaterial size={.022} vertexColors transparent opacity={.9} sizeAttenuation/>
    </points>
  );
}
function Ring3D({r,tube,spd,color,op}){
  const ref=useRef();
  useFrame(s=>{if(!ref.current)return;ref.current.rotation.x=s.clock.elapsedTime*spd;ref.current.rotation.z=s.clock.elapsedTime*spd*.5;});
  return <Float speed={.6} floatIntensity={.2}><mesh ref={ref}><torusGeometry args={[r,tube,3,130]}/><meshStandardMaterial color={color} metalness={.97} roughness={.03} transparent opacity={op}/></mesh></Float>;
}
function Diamond3D({pos,size,color,spd,op}){
  const ref=useRef();
  useFrame(s=>{if(!ref.current)return;ref.current.rotation.y=s.clock.elapsedTime*spd;ref.current.position.y=pos[1]+Math.sin(s.clock.elapsedTime*.6)*.2;});
  return <mesh ref={ref} position={pos}><octahedronGeometry args={[size,0]}/><meshStandardMaterial color={color} metalness={1} roughness={0} transparent opacity={op}/></mesh>;
}
function Scene(){
  const mobile=isMobile();
  return (
    <Canvas camera={{position:[0,0,10],fov:50}} style={{position:'fixed',inset:0,zIndex:0,pointerEvents:'none'}}>
      <ambientLight intensity={.22} color="#FDF8EC"/>
      <directionalLight position={[5,5,3]} intensity={.8} color="#D4AF37"/>
      <pointLight position={[-5,-4,-3]} intensity={.35} color="#E8B4B8"/>
      <GoldenDust/>
      <Ring3D r={6}  tube={.006} spd={.065} color="#D4AF37" op={.18}/>
      {!mobile && <Ring3D r={4}  tube={.005} spd={.1}   color="#E8CC6A" op={.12}/>}
      <Ring3D r={9}  tube={.004} spd={.04}  color="#C084FC" op={.08}/>
      {!mobile && <Diamond3D pos={[4,.5,-1]}   size={.65} color="#D4AF37" spd={.35} op={.32}/>}
      {!mobile && <Diamond3D pos={[-4,-.5,-2]} size={.45} color="#E8B4B8" spd={.25} op={.26}/>}
      <Stars radius={60} depth={28} count={mobile?400:800} factor={2} saturation={0} fade speed={.35}/>
    </Canvas>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// ✨  SPARKLE CURSOR  (mouse + touch)
// ══════════════════════════════════════════════════════════════════════════
function SparkleCanvas(){
  const ref=useRef();
  useEffect(()=>{
    const canvas=ref.current; if(!canvas) return;
    const ctx=canvas.getContext('2d');
    const resize=()=>{canvas.width=window.innerWidth;canvas.height=window.innerHeight;};
    resize(); window.addEventListener('resize',resize);

    const sparks=[];
    const COLS=['#D4AF37','#E8CC6A','#F0D060','#FFF5CC','#FFDDE8','#FFB7C5'];
    const isTouch='ontouchstart' in window;

    // Core emitter — draws 4-point star sparks
    const emit=(x,y,count=5,upward=true)=>{
      for(let i=0;i<count;i++){
        const a=Math.random()*Math.PI*2;
        const sp=Math.random()*2.2+.5;
        sparks.push({
          x,y,
          vx:Math.cos(a)*sp,
          vy:Math.sin(a)*sp-(upward?1.6:.3),
          life:1,
          decay:Math.random()*.02+.016,
          r:Math.random()*3+.8,
          color:COLS[Math.floor(Math.random()*COLS.length)],
        });
      }
    };

    // ── Desktop: mouse move ──
    const onMove=e=>emit(e.clientX,e.clientY,5);
    window.addEventListener('mousemove',onMove);

    // ── Mobile: touchstart (tap burst) ──
    const onTouchStart=e=>{
      for(let t=0;t<e.touches.length;t++) emit(e.touches[t].clientX,e.touches[t].clientY,10);
    };
    window.addEventListener('touchstart',onTouchStart,{passive:true});

    // ── Mobile: touchmove (drag trail) ──
    const onTouchMove=e=>{
      for(let t=0;t<e.touches.length;t++) emit(e.touches[t].clientX,e.touches[t].clientY,5);
    };
    window.addEventListener('touchmove',onTouchMove,{passive:true});

    // ── Mobile: scroll sparks — along both edges as page scrolls ──
    let lastSY=0;
    const onScroll=()=>{
      const delta=Math.abs(window.scrollY-lastSY);
      if(delta<4) return;
      lastSY=window.scrollY;
      // Left edge
      emit(Math.random()*60,             Math.random()*canvas.height, 2, false);
      // Right edge
      emit(canvas.width-Math.random()*60,Math.random()*canvas.height, 2, false);
    };
    window.addEventListener('scroll',onScroll,{passive:true});

    // ── Mobile ONLY: ambient floating sparkles ──
    // Fires every 280ms — fills screen with golden magic even without touch
    let ambientId;
    if(isTouch){
      const ambientPoints=[
        ()=>[Math.random()*canvas.width, Math.random()*canvas.height*.5],       // top half
        ()=>[Math.random()*canvas.width*.3, Math.random()*canvas.height],        // left strip
        ()=>[canvas.width*.7+Math.random()*canvas.width*.3,Math.random()*canvas.height], // right strip
        ()=>[canvas.width*.3+Math.random()*canvas.width*.4, Math.random()*canvas.height*.8], // center
      ];
      let ptIdx=0;
      ambientId=setInterval(()=>{
        const[x,y]=ambientPoints[ptIdx%ambientPoints.length]();
        ptIdx++;
        // Slow, gentle, upward drift — different from touch sparks
        for(let i=0;i<4;i++){
          sparks.push({
            x,y,
            vx:(Math.random()-.5)*.8,
            vy:-(Math.random()*.6+.2),   // float up slowly
            life:1,
            decay:Math.random()*.008+.007,  // very slow fade
            r:Math.random()*4+1.2,
            color:COLS[Math.floor(Math.random()*COLS.length)],
          });
        }
      },280);
    }

    // ── Draw loop ──
    const drawStar=(ctx,r)=>{
      ctx.beginPath();
      for(let j=0;j<4;j++){
        const a=(j*Math.PI)/2;
        if(j===0) ctx.moveTo(Math.cos(a)*r*2.2,Math.sin(a)*r*2.2);
        else       ctx.lineTo(Math.cos(a)*r*2.2,Math.sin(a)*r*2.2);
        ctx.lineTo(Math.cos(a+Math.PI/4)*r*.3,Math.sin(a+Math.PI/4)*r*.3);
      }
      ctx.closePath();
    };

    let raf;
    const loop=()=>{
      ctx.clearRect(0,0,canvas.width,canvas.height);
      for(let i=sparks.length-1;i>=0;i--){
        const s=sparks[i];
        s.x+=s.vx; s.y+=s.vy; s.vy+=.05; s.life-=s.decay;
        if(s.life<=0){sparks.splice(i,1);continue;}
        ctx.save();
        ctx.globalAlpha=s.life*.88;
        ctx.fillStyle=s.color;
        ctx.translate(s.x,s.y);
        ctx.rotate(s.life*5);
        drawStar(ctx,s.r*s.life);
        ctx.fill();
        ctx.restore();
      }
      raf=requestAnimationFrame(loop);
    };
    loop();

    return()=>{
      window.removeEventListener('resize',resize);
      window.removeEventListener('mousemove',onMove);
      window.removeEventListener('touchstart',onTouchStart);
      window.removeEventListener('touchmove',onTouchMove);
      window.removeEventListener('scroll',onScroll);
      if(ambientId) clearInterval(ambientId);
      cancelAnimationFrame(raf);
    };
  },[]);
  return <canvas ref={ref} style={{position:'fixed',inset:0,zIndex:9999,pointerEvents:'none'}}/>;
}

// ══════════════════════════════════════════════════════════════════════════
// 🌸  FALLING PETALS
// ══════════════════════════════════════════════════════════════════════════
const PETALS=Array.from({length: isMobile() ? 12 : 22},(_,i)=>({
  id:i,left:`${(i/22)*100+(Math.random()-.5)*6}%`,
  delay:`${(Math.random()*18).toFixed(1)}s`,dur:`${(13+Math.random()*9).toFixed(1)}s`,
  size:`${(9+Math.random()*11).toFixed(0)}px`,
  color:['#FFB7C5','#FFDDE1','#FFE8EC','#F5C0D0','#E8C4C4'][Math.floor(Math.random()*5)],
  dx:`${((Math.random()-.5)*160).toFixed(0)}px`,
  br:Math.random()>.5?'50% 0 50% 0':'50% 50% 0 50%',
}));
function FallingPetals(){
  return (
    <div style={{position:'fixed',inset:0,zIndex:1,pointerEvents:'none',overflow:'hidden'}}>
      {PETALS.map(p=>(
        <div key={p.id} style={{position:'absolute',top:'-30px',left:p.left,width:p.size,height:p.size,borderRadius:p.br,background:p.color,opacity:0,'--dx':p.dx,animation:`petal ${p.dur} ${p.delay} infinite linear`}}/>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// 🌌  AURORA
// ══════════════════════════════════════════════════════════════════════════
function Aurora(){
  return (
    <div style={{position:'fixed',inset:0,zIndex:0,overflow:'hidden',pointerEvents:'none'}}>
      <div style={{position:'absolute',top:'-25%',left:'-15%',width:'65%',height:'65%',borderRadius:'50%',background:'rgba(212,175,55,.05)',filter:'blur(80px)',animation:'auroraA 22s ease-in-out infinite'}}/>
      <div style={{position:'absolute',top:'25%',right:'-20%',width:'55%',height:'55%',borderRadius:'50%',background:'rgba(192,132,252,.036)',filter:'blur(80px)',animation:'auroraB 28s ease-in-out infinite'}}/>
      <div style={{position:'absolute',bottom:'-20%',left:'15%',width:'75%',height:'60%',borderRadius:'50%',background:'rgba(232,180,184,.04)',filter:'blur(80px)',animation:'auroraC 20s ease-in-out infinite'}}/>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// 📊  SCROLL PROGRESS BAR
// ══════════════════════════════════════════════════════════════════════════
function ProgressBar(){
  const {scrollYProgress}=useScroll();
  const w=useSpring(scrollYProgress,{stiffness:200,damping:30});
  return (
    <motion.div className="progress-bar" style={{position:'fixed',top:0,left:0,right:0,height:'2.5px',transformOrigin:'0%',background:'linear-gradient(to right,#D4AF37,#F0D060,#D4AF37)',scaleX:w,zIndex:9900,boxShadow:'0 0 8px rgba(212,175,55,.6)'}}/>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// 🔘  SIDE NAV (desktop only)
// ══════════════════════════════════════════════════════════════════════════
const NAVS=[
  {id:'hero',    label:'Home',     mIcon:'🏠'},
  {id:'story',   label:'Story',    mIcon:'💌'},
  {id:'events',  label:'Events',   mIcon:'📅'},
  {id:'gallery', label:'Gallery',  mIcon:'🖼'},
  {id:'rsvp',    label:'RSVP',     mIcon:'✉️'},
  {id:'blessings',label:'Blessings',mIcon:'💬'},
];
function useSectionActive(){
  const [active,setActive]=useState(0);
  useEffect(()=>{
    const fn=()=>{
      const mid=window.scrollY+window.innerHeight*.45;
      let cur=0;
      NAVS.forEach((s,i)=>{const el=document.getElementById(s.id);if(el&&el.offsetTop<=mid)cur=i;});
      setActive(cur);
    };
    window.addEventListener('scroll',fn,{passive:true});fn();
    return()=>window.removeEventListener('scroll',fn);
  },[]);
  return active;
}
function SideNav({show}){
  const active=useSectionActive();
  const [hov,setHov]=useState(null);
  return (
    <AnimatePresence>
      {show&&(
        <motion.div className="side-nav-wrap" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{delay:1.5}}
          style={{position:'fixed',right:'1.5rem',top:'50%',transform:'translateY(-50%)',zIndex:600,display:'flex',flexDirection:'column',gap:12}}>
          {NAVS.map((s,i)=>(
            <div key={s.id} style={{display:'flex',alignItems:'center',justifyContent:'flex-end',gap:8}}
              onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)}>
              <AnimatePresence>
                {hov===i&&<motion.span initial={{opacity:0,x:8}} animate={{opacity:1,x:0}} exit={{opacity:0}} style={{fontFamily:'Jost',fontSize:'.6rem',letterSpacing:'2px',color:'var(--G)',textTransform:'uppercase',whiteSpace:'nowrap'}}>{s.label}</motion.span>}
              </AnimatePresence>
              <motion.button onClick={()=>document.getElementById(s.id)?.scrollIntoView({behavior:'smooth'})}
                animate={{width:active===i?11:6,height:active===i?11:6,opacity:active===i?1:.42}}
                style={{borderRadius:'50%',background:active===i?'var(--G)':'transparent',border:'1px solid rgba(212,175,55,.5)',cursor:'pointer',padding:0,boxShadow:active===i?'0 0 12px rgba(212,175,55,.7)':'none'}}/>
            </div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// 📱  BOTTOM NAV BAR  (mobile only)
// ══════════════════════════════════════════════════════════════════════════
function BottomNav({show}){
  const active=useSectionActive();
  if(!show) return null;
  return (
    <div className="bottom-nav">
      {NAVS.slice(0,5).map((s,i)=>(
        <button key={s.id}
          onClick={()=>document.getElementById(s.id)?.scrollIntoView({behavior:'smooth'})}
          style={{
            flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
            gap:3,border:'none',background:'transparent',cursor:'pointer',padding:'0 2px',
            color:active===i?'var(--G)':'rgba(253,248,236,.32)',
            transition:'color .25s',position:'relative',
          }}>
          {/* Active dot */}
          {active===i&&<motion.div layoutId="bnDot" style={{position:'absolute',top:0,left:'50%',transform:'translateX(-50%)',width:28,height:2,background:'var(--G)',borderRadius:'0 0 3px 3px',boxShadow:'0 0 8px rgba(212,175,55,.7)'}}/>}
          <span style={{fontSize:'1.2rem',lineHeight:1}}>{s.mIcon}</span>
          <span style={{fontFamily:'Jost',fontSize:'.52rem',letterSpacing:'1.5px',textTransform:'uppercase'}}>{s.label}</span>
        </button>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// 🃏  3D TILT CARD  (disabled on touch devices)
// ══════════════════════════════════════════════════════════════════════════
function TiltCard({children,className,style,strength=8}){
  const ref=useRef();
  const touch=useRef(false);
  useEffect(()=>{touch.current=('ontouchstart' in window);},[]);
  const onMove=useCallback(e=>{
    if(touch.current) return;
    const el=ref.current;if(!el) return;
    const{left,top,width,height}=el.getBoundingClientRect();
    const x=((e.clientX-left)/width-.5)*strength;
    const y=((e.clientY-top)/height-.5)*-strength;
    el.style.transform=`perspective(900px) rotateX(${y}deg) rotateY(${x}deg) translateZ(6px)`;
    el.style.transition='transform .08s ease-out';
  },[strength]);
  const onLeave=useCallback(()=>{
    if(ref.current){ref.current.style.transform='perspective(900px) rotateX(0) rotateY(0) translateZ(0)';ref.current.style.transition='transform .5s ease-out';}
  },[]);
  // Touch: scale feedback
  const onTouchStart=()=>{if(ref.current)ref.current.style.transform='scale(.98)';};
  const onTouchEnd=()=>{if(ref.current)ref.current.style.transform='scale(1)';};
  return <div ref={ref} className={className} style={{...style,willChange:'transform',transition:'transform .5s ease-out'}} onMouseMove={onMove} onMouseLeave={onLeave} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>{children}</div>;
}

// ══════════════════════════════════════════════════════════════════════════
// 💌  ENVELOPE
// ══════════════════════════════════════════════════════════════════════════
function CornerSVG({style,d}){
  const map={tl:['M2,24 Q2,2 24,2','2,2'],tr:['M38,24 Q38,2 16,2','38,2'],bl:['M2,16 Q2,38 24,38','2,38'],br:['M38,16 Q38,38 16,38','38,38']};
  const[path,[cx,cy]]=[map[d][0],map[d][1].split(',')];
  return <svg width="36" height="36" style={style} viewBox="0 0 40 40"><path d={path} stroke="#D4AF37" strokeWidth="1.2" fill="none" opacity=".5"/><circle cx={cx} cy={cy} r="2.5" fill="#D4AF37" opacity=".5"/></svg>;
}
function BurstParticles({active}){
  const pts=useMemo(()=>Array.from({length:24},(_,i)=>{const a=(i/24)*Math.PI*2,d=80+Math.random()*120;return{x:Math.cos(a)*d,y:Math.sin(a)*d,size:3+Math.random()*5,color:['#D4AF37','#E8CC6A','#F0D060','#FFDDE8'][Math.floor(Math.random()*4)]};}),[]);
  return <AnimatePresence>{active&&pts.map((p,i)=><motion.div key={i} initial={{x:0,y:0,opacity:1,scale:1}} animate={{x:p.x,y:p.y,opacity:0,scale:0}} transition={{duration:.9,delay:i*.016,ease:'easeOut'}} style={{position:'absolute',top:'50%',left:'50%',width:p.size,height:p.size,borderRadius:'50%',background:p.color,marginLeft:-p.size/2,marginTop:-p.size/2,pointerEvents:'none'}}/>)}</AnimatePresence>;
}
function Envelope({onOpen}){
  const[clicked,setClicked]=useState(false);
  const[gone,setGone]=useState(false);
  const[burst,setBurst]=useState(false);
  const open=useCallback(()=>{
    if(clicked) return;
    setClicked(true);setBurst(true);
    setTimeout(()=>{setGone(true);onOpen();},1500);
  },[clicked,onOpen]);
  if(gone) return null;
  const half={position:'fixed',top:0,height:'100vh',width:'50%',zIndex:9000,cursor:clicked?'default':'pointer'};
  return (
    <>
      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.8}}>
        <div className={`env-linen ${clicked?'env-l':''}`} style={{...half,left:0}} onClick={open}>
          <div style={{position:'absolute',inset:20,border:'1px solid rgba(212,175,55,.3)',borderRight:'none',borderRadius:'4px 0 0 4px'}}/>
          <CornerSVG style={{position:'absolute',top:28,left:28}}  d="tl"/>
          <CornerSVG style={{position:'absolute',bottom:28,left:28}} d="bl"/>
          <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(212,175,55,.04) 0%,transparent 50%,rgba(212,175,55,.04) 100%)',pointerEvents:'none'}}/>
        </div>
        <div className={`env-linen ${clicked?'env-r':''}`} style={{...half,right:0,left:'auto'}} onClick={open}>
          <div style={{position:'absolute',inset:20,border:'1px solid rgba(212,175,55,.3)',borderLeft:'none',borderRadius:'0 4px 4px 0'}}/>
          <CornerSVG style={{position:'absolute',top:28,right:28}}    d="tr"/>
          <CornerSVG style={{position:'absolute',bottom:28,right:28}} d="br"/>
          <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(212,175,55,.04) 0%,transparent 50%,rgba(212,175,55,.04) 100%)',pointerEvents:'none'}}/>
        </div>
        {!clicked&&<div style={{position:'fixed',top:0,left:'50%',width:'1px',height:'100vh',background:'rgba(212,175,55,.15)',zIndex:9001,transform:'translateX(-50%)',pointerEvents:'none'}}/>}
        <svg style={{position:'fixed',top:0,left:0,width:'100%',zIndex:8999,pointerEvents:'none'}} height="100" viewBox="0 0 1440 100" preserveAspectRatio="none">
          <polygon points="0,0 720,85 1440,0" fill="#F5EDD6" opacity=".65"/>
          <polygon points="0,0 720,85 1440,0" fill="none" stroke="rgba(212,175,55,.22)" strokeWidth="1"/>
        </svg>
        <svg style={{position:'fixed',bottom:0,left:0,width:'100%',zIndex:8999,pointerEvents:'none'}} height="100" viewBox="0 0 1440 100" preserveAspectRatio="none">
          <polygon points="0,100 720,15 1440,100" fill="#F5EDD6" opacity=".65"/>
          <polygon points="0,100 720,15 1440,100" fill="none" stroke="rgba(212,175,55,.22)" strokeWidth="1"/>
        </svg>
      </motion.div>
      {/* Wax Seal */}
      <div className={clicked?'seal-fade':''} onClick={open}
        style={{position:'fixed',top:'50%',left:'50%',transform:'translate(-50%,-50%)',zIndex:9002,textAlign:'center',cursor:clicked?'default':'pointer',userSelect:'none'}}>
        <div style={{position:'relative',display:'inline-block'}}>
          <BurstParticles active={burst}/>
          <div style={{position:'absolute',inset:-13,borderRadius:'50%',border:'1px dashed rgba(212,175,55,.3)',animation:clicked?'none':'floatY 4s ease-in-out infinite'}}/>
          <div className={clicked?'':'seal-pulse'} style={{width:isMobile()?150:175,height:isMobile()?150:175,borderRadius:'50%',background:'conic-gradient(from 0deg,#96700A,#C8960A,#D4AF37,#F0D060,#E8CC6A,#D4AF37,#B8860B,#96700A)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',boxShadow:'0 0 0 6px #FBF4E4,0 0 0 8px rgba(212,175,55,.22),0 10px 45px rgba(0,0,0,.18)',position:'relative'}}>
            <div style={{position:'absolute',inset:10,borderRadius:'50%',border:'1.5px solid rgba(255,255,255,.4)'}}/>
            <div style={{position:'absolute',inset:16,borderRadius:'50%',border:'.5px solid rgba(255,255,255,.2)'}}/>
            {[0,45,90,135,180,225,270,315].map(deg=>(
              <div key={deg} style={{position:'absolute',width:4,height:16,borderRadius:2,background:'rgba(255,255,255,.12)',top:'50%',left:'50%',transformOrigin:'0 -50px',transform:`translate(-50%,-50%) rotate(${deg}deg) translateY(-50px)`}}/>
            ))}
            <p className="serif" style={{fontSize:isMobile()?'2.2rem':'2.7rem',fontWeight:300,color:'#FBF4E4',letterSpacing:'4px',lineHeight:1,textShadow:'0 2px 10px rgba(0,0,0,.3)',position:'relative',zIndex:1}}>A & H</p>
            <p style={{fontFamily:'Jost',fontSize:'.44rem',letterSpacing:'4px',color:'rgba(251,244,228,.6)',marginTop:4,position:'relative',zIndex:1}}>DECEMBER 2026</p>
          </div>
        </div>
        {!clicked&&<div style={{marginTop:'1.4rem',animation:'floatY 3s ease-in-out infinite'}}>
          <p style={{fontFamily:'Jost',fontSize:'.65rem',letterSpacing:'5px',textTransform:'uppercase',color:'rgba(120,82,12,.72)'}}>✦ Click to Open ✦</p>
        </div>}
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// ⏱  COUNTDOWN HOOK
// ══════════════════════════════════════════════════════════════════════════
function useCountdown(target){
  const[t,setT]=useState({days:0,hours:0,minutes:0,seconds:0});
  useEffect(()=>{
    const tick=()=>{const d=target-Date.now();if(d<=0)return;setT({days:Math.floor(d/86400000),hours:Math.floor(d%86400000/3600000),minutes:Math.floor(d%3600000/60000),seconds:Math.floor(d%60000/1000)});};
    tick();const id=setInterval(tick,1000);return()=>clearInterval(id);
  },[target]);
  return t;
}

// ══════════════════════════════════════════════════════════════════════════
// 🔤  SHARED TYPOGRAPHY
// ══════════════════════════════════════════════════════════════════════════
const SHIMMER={background:'linear-gradient(110deg,var(--C) 0%,var(--G2) 45%,var(--C) 100%)',backgroundSize:'200% auto',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',animation:'shimmer 5s linear infinite'};
function Eye({children}){return <motion.p initial={{opacity:0,y:14}} whileInView={{opacity:1,y:0}} viewport={{once:true}} style={{fontFamily:'Jost',fontSize:'.68rem',letterSpacing:'6px',textTransform:'uppercase',color:'var(--G)',marginBottom:'.65rem'}}>✦ {children} ✦</motion.p>;}
function SecHead({children,sub}){return <motion.div initial={{opacity:0,y:26}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:.1}} style={{textAlign:'center',marginBottom:sub?'1rem':'4rem'}}><h2 className="serif sec-title" style={{fontSize:'clamp(2.2rem,5vw,3.8rem)',fontWeight:300,lineHeight:1.15,color:'var(--C)'}}>{children}</h2>{sub&&<p style={{color:'var(--M)',maxWidth:'480px',margin:'1rem auto 0',lineHeight:1.88,fontSize:'.9rem'}}>{sub}</p>}</motion.div>;}

// Letter animation
const letterV={hidden:{opacity:0,y:50},visible:(i)=>({opacity:1,y:0,transition:{delay:i*.05,duration:.55,ease:[.22,1,.36,1]}})};
function AnimName({name,delay=0}){
  return <span aria-label={name}>{name.split('').map((ch,i)=><motion.span key={i} custom={i} variants={letterV} initial="hidden" animate="visible" style={{display:'inline-block',whiteSpace:ch===' '?'pre':'normal'}} transition={{delay:delay+i*.05}}>{ch}</motion.span>)}</span>;
}

// ══════════════════════════════════════════════════════════════════════════
// 🌹  HERO
// ══════════════════════════════════════════════════════════════════════════
function Hero(){
  const cd=useCountdown(W.date);
  const units=[{l:'Days',v:String(cd.days).padStart(2,'0')},{l:'Hours',v:String(cd.hours).padStart(2,'0')},{l:'Mins',v:String(cd.minutes).padStart(2,'0')},{l:'Secs',v:String(cd.seconds).padStart(2,'0')}];
  return (
    <section id="hero" className="section top-safe" style={{textAlign:'center',paddingTop:'max(var(--SAT),60px)'}}>
      <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 50% 40%,rgba(212,175,55,.09) 0%,transparent 65%)',pointerEvents:'none'}}/>
      <div style={{position:'relative',zIndex:1,width:'100%',maxWidth:600}}>
        <motion.p initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:.3}}
          style={{fontFamily:'Jost',fontSize:'.68rem',letterSpacing:'7px',textTransform:'uppercase',color:'var(--G)',marginBottom:'1.8rem'}}>
          ✦ The Wedding Celebration of ✦
        </motion.p>
        <h1 className="serif hero-name" style={{fontSize:'clamp(3.5rem,13vw,8rem)',fontWeight:300,lineHeight:1,marginBottom:'.3rem',...SHIMMER}}>
          <AnimName name="Aqsa" delay={.5}/>
        </h1>
        <motion.div initial={{opacity:0,scaleX:0}} animate={{opacity:1,scaleX:1}} transition={{delay:1,duration:.8}}
          style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'1.2rem',margin:'.4rem 0'}}>
          <div style={{height:'1px',width:'clamp(40px,10vw,80px)',background:'linear-gradient(to right,transparent,var(--G))'}}/>
          <span className="serif" style={{fontSize:'1.8rem',color:'var(--G)',fontWeight:300}}>&</span>
          <div style={{height:'1px',width:'clamp(40px,10vw,80px)',background:'linear-gradient(to left,transparent,var(--G))'}}/>
        </motion.div>
        <h1 className="serif hero-name" style={{fontSize:'clamp(3.5rem,13vw,8rem)',fontWeight:300,lineHeight:1,marginBottom:'2.2rem',...SHIMMER}}>
          <AnimName name="Huzaifa" delay={.7}/>
        </h1>
        <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.2}}
          style={{fontFamily:'Jost',fontSize:'.75rem',letterSpacing:'5px',color:'var(--M)',marginBottom:'2.5rem',textTransform:'uppercase'}}>
          December 15th, 2026 · Karachi
        </motion.p>
        {/* Countdown */}
        <motion.div initial={{opacity:0,y:26}} animate={{opacity:1,y:0}} transition={{delay:1.4}}
          className="cd-row" style={{display:'flex',gap:'.8rem',justifyContent:'center',flexWrap:'nowrap',marginBottom:'2.5rem'}}>
          {units.map(({l,v})=>(
            <TiltCard key={l} className="gc cd-box" style={{minWidth:'80px',padding:'1rem .8rem',textAlign:'center',flex:1,maxWidth:'110px'}} strength={5}>
              <div className="serif cd-num" style={{fontSize:'2.4rem',fontWeight:300,color:'var(--G)',lineHeight:1}}>{v}</div>
              <div style={{fontSize:'.58rem',letterSpacing:'2.5px',color:'var(--M)',marginTop:'.35rem',textTransform:'uppercase'}}>{l}</div>
            </TiltCard>
          ))}
        </motion.div>
        <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.7}}
          style={{fontFamily:'Jost',fontSize:'.78rem',letterSpacing:'3px',color:'var(--G)',opacity:.6}}>{W.hashtag}</motion.p>
        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:2.2}}
          style={{marginTop:'3.5rem',display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
          <span style={{fontSize:'.6rem',letterSpacing:'4px',color:'var(--M)',textTransform:'uppercase'}}>Scroll</span>
          <motion.div animate={{y:[0,10,0]}} transition={{duration:1.6,repeat:Infinity}} style={{width:'1px',height:38,background:'linear-gradient(to bottom,var(--G),transparent)'}}/>
        </motion.div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// 📖  OUR STORY
// ══════════════════════════════════════════════════════════════════════════
function OurStory(){
  return (
    <section id="story" className="section">
      <div style={{width:'100%',maxWidth:'880px',zIndex:1,position:'relative'}}>
        <div style={{textAlign:'center',marginBottom:'4rem'}}><Eye>How It Began</Eye><SecHead sub="A love story written in the stars, unfolding one beautiful chapter at a time.">Our Story</SecHead></div>
        <div className="tl-wrap" style={{position:'relative'}}>
          {/* Vertical rail */}
          <div className="tl-rail" style={{position:'absolute',left:'50%',top:0,bottom:0,width:'1px',transform:'translateX(-50%)',background:'linear-gradient(to bottom,transparent,rgba(212,175,55,.35) 12%,rgba(212,175,55,.35) 88%,transparent)'}}/>
          {W.timeline.map((item,i)=>{
            const left=i%2===0;
            return (
              <motion.div key={item.year} initial={{opacity:0,x:left?-45:45}} whileInView={{opacity:1,x:0}} viewport={{once:true,margin:'-60px'}} transition={{duration:.8,delay:i*.065}}
                className="tl-item" style={{display:'flex',justifyContent:left?'flex-start':'flex-end',marginBottom:'2.5rem',position:'relative',alignItems:'center'}}>
                <div className="tl-dot" style={{position:'absolute',left:'50%',top:'50%',transform:'translate(-50%,-50%)',width:13,height:13,borderRadius:'50%',background:'var(--G)',boxShadow:'0 0 18px rgba(212,175,55,.8)',zIndex:2}}/>
                <div className="tl-year-badge" style={{position:'absolute',left:'50%',top:'50%',transform:left?'translate(16px,-50%)':'translate(calc(-100% - 16px),-50%)',fontSize:'.58rem',letterSpacing:'3px',color:'var(--G)',fontFamily:'Jost',textTransform:'uppercase',whiteSpace:'nowrap',zIndex:2}}>{item.year}</div>
                <TiltCard className="gc tl-content" style={{width:'44%',padding:'1.5rem',textAlign:left?'right':'left'}} strength={4}>
                  <div style={{fontSize:'1.7rem',marginBottom:'.4rem'}}>{item.icon}</div>
                  <h3 className="serif" style={{fontSize:'1.3rem',fontWeight:300,color:'var(--C)',marginBottom:'.4rem'}}>{item.title}</h3>
                  <p style={{fontSize:'.85rem',lineHeight:1.88,color:'var(--M)'}}>{item.desc}</p>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// 📅  EVENTS
// ══════════════════════════════════════════════════════════════════════════
function Events(){
  return (
    <section id="events" className="section" style={{background:'rgba(212,175,55,.015)'}}>
      <div style={{width:'100%',maxWidth:'1100px',zIndex:1,position:'relative'}}>
        <div style={{textAlign:'center',marginBottom:'4rem'}}><Eye>Mark Your Calendar</Eye><SecHead sub="Three magical evenings, one lifetime of memories.">Wedding Events</SecHead></div>
        <div className="events-grid" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1.2rem'}}>
          {W.events.map((ev,i)=>(
            <motion.div key={ev.id} initial={{opacity:0,y:60}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.7,delay:i*.12}}>
              <TiltCard className="gc" style={{padding:'1.75rem',position:'relative',overflow:'hidden',borderColor:ev.accent+'35',height:'100%'}} strength={6}>
                <div style={{position:'absolute',top:0,left:0,right:0,height:'3px',background:`linear-gradient(to right,${ev.accent},transparent)`}}/>
                <div style={{position:'absolute',top:'-15%',left:'-5%',width:'55%',height:'55%',borderRadius:'50%',background:ev.accent,opacity:.04,filter:'blur(26px)',pointerEvents:'none'}}/>
                <div style={{fontSize:'2.2rem',marginBottom:'.8rem'}}>{ev.icon}</div>
                <span style={{display:'inline-block',fontSize:'.62rem',letterSpacing:'3px',textTransform:'uppercase',padding:'4px 12px',borderRadius:'100px',border:`1px solid ${ev.accent}55`,color:ev.accent,marginBottom:'.8rem'}}>{ev.day}</span>
                <h3 className="serif" style={{fontSize:'1.7rem',fontWeight:300,color:'var(--C)',lineHeight:1.15,marginBottom:'.2rem'}}>{ev.name}</h3>
                <p style={{fontSize:'.7rem',letterSpacing:'2px',color:ev.accent,marginBottom:'1.2rem',textTransform:'uppercase'}}>{ev.date}</p>
                {[['🕐',ev.time],['📍',ev.venue],['🌆',ev.city],['👗',ev.dress]].map(([ic,tx])=>(
                  <div key={tx} style={{display:'flex',gap:'.5rem',alignItems:'flex-start',marginBottom:'.45rem'}}>
                    <span style={{fontSize:'.82rem',flexShrink:0}}>{ic}</span>
                    <span style={{fontSize:'.78rem',color:'var(--M)',lineHeight:1.55}}>{tx}</span>
                  </div>
                ))}
                <p style={{marginTop:'1rem',fontSize:'.82rem',lineHeight:1.75,color:'rgba(253,248,236,.38)',fontStyle:'italic'}}>"{ev.desc}"</p>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// 🖼️  GALLERY
// ══════════════════════════════════════════════════════════════════════════
function Gallery(){
  const[lb,setLb]=useState(null);
  return (
    <section id="gallery" className="section">
      <div style={{width:'100%',maxWidth:'1100px',zIndex:1,position:'relative'}}>
        <div style={{textAlign:'center',marginBottom:'4rem'}}><Eye>Our Memories</Eye><SecHead sub="Moments frozen in time — a glimpse into the love story of Aqsa & Huzaifa.">Photo Gallery</SecHead></div>
        <div className="gallery-grid" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1rem',gridAutoRows:'200px'}}>
          {W.gallery.map((item,i)=>(
            <motion.div key={item.id} initial={{opacity:0,scale:.92}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={{duration:.6,delay:i*.07}}
              whileHover={{scale:1.03}} whileTap={{scale:.97}}
              onClick={()=>setLb(item)}
              className="gal-span"
              style={{gridColumn:item.span>1?`span ${item.span}`:undefined,background:item.g,borderRadius:16,cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',position:'relative',overflow:'hidden',border:'1px solid rgba(255,255,255,.1)'}}>
              <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(0,0,0,.55) 0%,transparent 55%)',borderRadius:16}}/>
              <div style={{position:'absolute',bottom:'1rem',left:'1.2rem',right:'1.2rem',textAlign:'left'}}>
                <p className="serif" style={{fontSize:'1.3rem',color:'#fff',fontWeight:300,lineHeight:1}}>{item.label}</p>
                <p style={{fontFamily:'Jost',fontSize:'.65rem',color:'rgba(255,255,255,.6)',letterSpacing:'2px',marginTop:4}}>{item.sub}</p>
              </div>
              <div style={{position:'absolute',top:'.8rem',right:'.8rem',width:30,height:30,borderRadius:'50%',background:'rgba(255,255,255,.14)',backdropFilter:'blur(8px)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.85rem'}}>🔍</div>
            </motion.div>
          ))}
        </div>
        <p style={{textAlign:'center',marginTop:'1.2rem',fontSize:'.72rem',letterSpacing:'2px',color:'rgba(253,248,236,.25)'}}>Replace gradients with your actual wedding photos</p>
      </div>
      <AnimatePresence>
        {lb&&(
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            onClick={()=>setLb(null)}
            style={{position:'fixed',inset:0,background:'rgba(0,0,0,.88)',zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center',backdropFilter:'blur(8px)',padding:'1.5rem'}}>
            <motion.div initial={{scale:.75,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:.75,opacity:0}} transition={{type:'spring',stiffness:320,damping:26}}
              onClick={e=>e.stopPropagation()}
              style={{width:'min(90vw,700px)',height:'min(75vh,500px)',borderRadius:22,background:lb.g,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'flex-end',padding:'2rem',position:'relative',overflow:'hidden'}}>
              <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(0,0,0,.55) 0%,transparent 55%)'}}/>
              <div style={{position:'relative',zIndex:1,textAlign:'center'}}>
                <h3 className="serif" style={{fontSize:'2.2rem',fontWeight:300,color:'#fff'}}>{lb.label}</h3>
                <p style={{fontFamily:'Jost',fontSize:'.75rem',color:'rgba(255,255,255,.6)',letterSpacing:'2px',marginTop:6}}>{lb.sub}</p>
              </div>
              <button onClick={()=>setLb(null)} style={{position:'absolute',top:'1rem',right:'1rem',width:36,height:36,borderRadius:'50%',background:'rgba(255,255,255,.15)',border:'1px solid rgba(255,255,255,.25)',color:'#fff',cursor:'pointer',fontSize:'1rem',display:'flex',alignItems:'center',justifyContent:'center'}}>✕</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// 📋  RSVP
// ══════════════════════════════════════════════════════════════════════════
function RSVP(){
  const[form,setForm]=useState({name:'',phone:'',email:'',attending:'yes',events:[],food:'nonveg',blessing:''});
  const[submitted,setSubmitted]=useState(false);
  const[loading,setLoading]=useState(false);
  const inp=e=>{const{name,type,value,checked}=e.target;if(type==='checkbox')setForm(f=>({...f,events:checked?[...f.events,value]:f.events.filter(x=>x!==value)}));else setForm(f=>({...f,[name]:value}));};
  const submit=async e=>{e.preventDefault();setLoading(true);await W.rsvp.submit(form);setTimeout(()=>{setLoading(false);setSubmitted(true);},900);};
  const IS={width:'100%',background:'rgba(253,248,236,.04)',border:'1px solid rgba(212,175,55,.2)',borderRadius:14,padding:'14px 18px',color:'var(--C)',fontFamily:'Jost,sans-serif',fontSize:'16px',outline:'none',transition:'border-color .3s,background .3s',WebkitAppearance:'none'};
  const LS={display:'block',fontSize:'.65rem',letterSpacing:'3px',color:'var(--G)',marginBottom:8,textTransform:'uppercase',fontFamily:'Jost,sans-serif'};
  return (
    <section id="rsvp" className="section">
      <div style={{width:'100%',maxWidth:680,zIndex:1,position:'relative'}}>
        <div style={{textAlign:'center',marginBottom:'3.5rem'}}><Eye>You're Invited</Eye><SecHead sub="Your presence is the greatest gift. Let us know if you'll be joining.">RSVP</SecHead><p style={{fontSize:'.75rem',letterSpacing:'2px',color:'var(--G)',opacity:.6}}>Respond by December 1st, 2026</p></div>
        <AnimatePresence mode="wait">
          {submitted?(
            <motion.div key="ok" initial={{opacity:0,scale:.85}} animate={{opacity:1,scale:1}} className="gc" style={{padding:'3rem 2rem',textAlign:'center'}}>
              <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:'spring',delay:.2}} style={{fontSize:'3rem',marginBottom:'1rem'}}>💌</motion.div>
              <h3 className="serif" style={{fontSize:'2.2rem',fontWeight:300,color:'var(--C)',marginBottom:'.8rem'}}>Thank You, {form.name.split(' ')[0]}!</h3>
              <p style={{color:'var(--M)',lineHeight:1.88,fontSize:'.9rem'}}>Your RSVP has been received with joy. We look forward to celebrating with you. May Allah bless you and your family.</p>
              <div style={{marginTop:'1.8rem',padding:'1rem',borderRadius:12,background:'rgba(212,175,55,.07)',border:'1px solid rgba(212,175,55,.18)'}}><p style={{fontSize:'.75rem',letterSpacing:'2px',color:'var(--G)'}}>{W.hashtag}</p></div>
            </motion.div>
          ):(
            <motion.form key="form" onSubmit={submit} initial={{opacity:0}} animate={{opacity:1}} className="gc" style={{padding:'2rem 1.5rem'}}>
              <div style={{display:'grid',gap:'1.25rem'}}>
                <div><label style={LS}>Full Name</label><input className="pin" style={IS} type="text" name="name" value={form.name} onChange={inp} placeholder="Your full name" required/></div>
                <div className="rsvp-2col" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
                  <div><label style={LS}>WhatsApp</label><input className="pin" style={IS} type="tel" name="phone" value={form.phone} onChange={inp} placeholder="+92 3XX XXXXXXX"/></div>
                  <div><label style={LS}>Email</label><input className="pin" style={IS} type="email" name="email" value={form.email} onChange={inp} placeholder="you@email.com"/></div>
                </div>
                <div><label style={LS}>Attending?</label>
                  <div className="rsvp-attend" style={{display:'flex',gap:'.75rem'}}>
                    {[{v:'yes',l:'Yes, I\'ll be there! 🎊'},{v:'no',l:'Sadly, unable to attend'}].map(({v,l})=>(
                      <label key={v} style={{flex:1,display:'flex',alignItems:'center',gap:10,padding:'13px 14px',borderRadius:14,border:`1px solid ${form.attending===v?'rgba(212,175,55,.5)':'rgba(212,175,55,.15)'}`,cursor:'pointer',background:form.attending===v?'rgba(212,175,55,.08)':'transparent',transition:'all .2s',fontSize:'.84rem',color:'var(--C)',minHeight:48}}>
                        <input type="radio" name="attending" value={v} checked={form.attending===v} onChange={inp} style={{accentColor:'var(--G)',width:18,height:18}}/>{l}
                      </label>
                    ))}
                  </div>
                </div>
                <div><label style={LS}>Events</label>
                  <div style={{display:'flex',gap:'.6rem',flexWrap:'wrap'}}>
                    {W.events.map(ev=>(
                      <label key={ev.id} style={{display:'flex',alignItems:'center',gap:7,padding:'10px 14px',borderRadius:'100px',border:`1px solid ${form.events.includes(ev.name)?ev.accent+'77':'rgba(212,175,55,.15)'}`,cursor:'pointer',background:form.events.includes(ev.name)?ev.accent+'10':'transparent',transition:'all .2s',fontSize:'.8rem',color:'var(--C)',whiteSpace:'nowrap',minHeight:44}}>
                        <input type="checkbox" value={ev.name} checked={form.events.includes(ev.name)} onChange={inp} style={{accentColor:ev.accent,width:16,height:16}}/>{ev.icon} {ev.name}
                      </label>
                    ))}
                  </div>
                </div>
                <div><label style={LS}>Food Preference</label>
                  <select className="pin" style={IS} name="food" value={form.food} onChange={inp}>
                    <option value="nonveg">Non-Vegetarian</option><option value="veg">Vegetarian</option><option value="vegan">Vegan</option><option value="halal">Halal Only</option>
                  </select>
                </div>
                <div><label style={LS}>Your Blessing ✨</label>
                  <textarea className="pin" style={{...IS,height:100,resize:'none'}} name="blessing" value={form.blessing} onChange={inp} placeholder="Share your warmest wishes..."/>
                </div>
                <motion.button type="submit" disabled={loading} whileHover={{scale:1.02}} whileTap={{scale:.96}}
                  style={{width:'100%',padding:'16px',background:'linear-gradient(135deg,rgba(212,175,55,.18),rgba(212,175,55,.08))',border:'1px solid rgba(212,175,55,.38)',borderRadius:14,color:'var(--G)',fontFamily:'Jost,sans-serif',fontSize:'.8rem',letterSpacing:'4px',textTransform:'uppercase',cursor:loading?'wait':'pointer',transition:'all .3s',minHeight:52}}>
                  {loading?'✦ Sending... ✦':'✦ Confirm Attendance ✦'}
                </motion.button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// 💬  BLESSINGS
// ══════════════════════════════════════════════════════════════════════════
function Blessings(){
  return (
    <section id="blessings" className="section" style={{background:'rgba(212,175,55,.013)'}}>
      <div style={{width:'100%',maxWidth:1100,zIndex:1,position:'relative'}}>
        <div style={{textAlign:'center',marginBottom:'4rem'}}><Eye>Words of Love</Eye><SecHead sub="Heartfelt messages from the people who love Aqsa & Huzaifa the most.">Blessings Wall</SecHead></div>
        <div className="bless-grid" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1.1rem'}}>
          {W.blessings.map((b,i)=>(
            <motion.div key={b.name} initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.6,delay:i*.07}}>
              <TiltCard className="gc" style={{padding:'1.6rem',position:'relative',overflow:'hidden',height:'100%'}} strength={5}>
                <div className="serif" style={{position:'absolute',top:8,right:16,fontSize:'5rem',color:'rgba(212,175,55,.07)',lineHeight:1,userSelect:'none'}}>"</div>
                <p style={{fontSize:'.87rem',lineHeight:1.95,color:'rgba(253,248,236,.72)',marginBottom:'1.3rem',fontStyle:'italic',position:'relative',zIndex:1}}>{b.msg}</p>
                <div style={{display:'flex',alignItems:'center',gap:'.7rem'}}>
                  <div style={{width:38,height:38,borderRadius:'50%',background:'linear-gradient(135deg,var(--G),#7A5B10)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                    <span className="serif" style={{fontSize:'1rem',color:'#FBF5E8',fontWeight:300}}>{b.a}</span>
                  </div>
                  <div><p style={{fontSize:'.85rem',color:'var(--C)',fontWeight:500}}>{b.name}</p><p style={{fontSize:'.68rem',color:'var(--G)',letterSpacing:'1px',opacity:.8}}>{b.rel}</p></div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// 🌙  FOOTER
// ══════════════════════════════════════════════════════════════════════════
function Footer(){
  return (
    <motion.footer initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}}
      style={{textAlign:'center',padding:'5rem 2rem calc(var(--BNH) + var(--SAB) + 3rem)',position:'relative',zIndex:1,borderTop:'1px solid rgba(212,175,55,.1)'}}>
      <div style={{display:'flex',alignItems:'center',gap:'1.2rem',justifyContent:'center',marginBottom:'3rem'}}>
        <div style={{flex:1,height:'1px',maxWidth:120,background:'linear-gradient(to right,transparent,rgba(212,175,55,.3))'}}/>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2L13.5 10H21L15 14.5L17.5 22L12 17L6.5 22L9 14.5L3 10H10.5Z" stroke="#D4AF37" strokeWidth=".7" fill="rgba(212,175,55,.1)"/></svg>
        <div style={{flex:1,height:'1px',maxWidth:120,background:'linear-gradient(to left,transparent,rgba(212,175,55,.3))'}}/>
      </div>
      <p style={{fontFamily:'Jost',fontSize:'.65rem',letterSpacing:'6px',color:'var(--G)',marginBottom:'1.3rem',textTransform:'uppercase',opacity:.6}}>✦ Together Forever ✦</p>
      <h2 className="serif" style={{fontSize:'clamp(2.5rem,8vw,6rem)',fontWeight:300,lineHeight:1,...SHIMMER,animation:'shimmer 6s linear infinite',marginBottom:'.8rem'}}>Aqsa & Huzaifa</h2>
      <p style={{fontFamily:'Jost',fontSize:'.75rem',letterSpacing:'5px',color:'var(--M)',marginBottom:'2.5rem',textTransform:'uppercase'}}>December 15, 2026</p>
      <p style={{fontFamily:'Jost',fontSize:'.68rem',color:'rgba(253,248,236,.2)',letterSpacing:'2px'}}>Made with ❤️ · {W.hashtag}</p>
    </motion.footer>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// 🎵  MUSIC BUTTON
// ══════════════════════════════════════════════════════════════════════════
function MusicBtn({show}){
  const[playing,setPlaying]=useState(false);
  const audio=useRef(null);
  useEffect(()=>{
    audio.current=new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
    audio.current.loop=true;
    return()=>{try{audio.current.pause();}catch(_){}};
  },[]);
  const toggle=()=>{playing?audio.current.pause():audio.current.play().catch(()=>{});setPlaying(p=>!p);};
  return (
    <AnimatePresence>
      {show&&(
        <motion.button initial={{opacity:0,scale:.5}} animate={{opacity:1,scale:1}} exit={{opacity:0}} transition={{delay:1.5}}
          onClick={toggle}
          style={{position:'fixed',bottom:`calc(var(--BNH) + var(--SAB) + 1rem)`,right:'1.2rem',zIndex:800,width:48,height:48,borderRadius:'50%',background:'rgba(212,175,55,.13)',border:'1px solid rgba(212,175,55,.35)',color:'var(--G)',fontSize:'1.1rem',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',backdropFilter:'blur(12px)',boxShadow:playing?'0 0 22px rgba(212,175,55,.4)':'none',transition:'box-shadow .3s'}}>
          {playing?'⏸':'🎵'}
        </motion.button>
      )}
    </AnimatePresence>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// 🎊  ROOT APP
// ══════════════════════════════════════════════════════════════════════════
export default function App(){
  const[opened,setOpened]=useState(false);
  return (
    <>
      <style>{CSS}</style>
      <Scene/>
      <Aurora/>
      <FallingPetals/>
      <SparkleCanvas/>
      {opened&&<ProgressBar/>}
      <SideNav show={opened}/>
      <BottomNav show={opened}/>
      <Envelope onOpen={()=>setOpened(true)}/>
      <MusicBtn show={opened}/>
      <AnimatePresence>
        {opened&&(
          <motion.div key="main" initial={{opacity:0}} animate={{opacity:1}} transition={{duration:1.3,delay:.4}}>
            <Hero/>
            <OurStory/>
            <Events/>
            <Gallery/>
            <RSVP/>
            <Blessings/>
            <Footer/>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
