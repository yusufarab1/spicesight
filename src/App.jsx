import { useState, useRef, useEffect } from "react";

// ─── Data ─────────────────────────────────────────────────────────────────────
const MEATS = [
  { id:"chicken", label:"Chicken", emoji:"🍗", color:"#c8440c" },
  { id:"beef",    label:"Beef",    emoji:"🥩", color:"#a31515" },
  { id:"lamb",    label:"Lamb",    emoji:"🫀", color:"#9b2a5a" },
  { id:"fish",    label:"Fish",    emoji:"🐟", color:"#1a6e8a" },
  { id:"turkey",  label:"Turkey",  emoji:"🦃", color:"#5a7a1a" },
  { id:"goat",    label:"Goat",    emoji:"🐐", color:"#c86a1a" },
  { id:"pork",    label:"Pork",    emoji:"🥓", color:"#c84a2e" },
  { id:"venison", label:"Venison", emoji:"🦌", color:"#8b6040" },
  { id:"shrimp",  label:"Shrimp",  emoji:"🍤", color:"#c86a1a" },
  { id:"salmon",  label:"Salmon",  emoji:"🐠", color:"#c85030" },
];

const METHODS = [
  { id:"Grill",     icon:"🔥" },
  { id:"Oven",      icon:"♨️" },
  { id:"Air Fryer", icon:"💨" },
  { id:"Pan-Fry",   icon:"🍳" },
  { id:"Slow Cook", icon:"⏱" },
  { id:"Smoke",     icon:"🌫" },
];

const QUICK_SPICES = [
  "Garlic powder","Cumin","Paprika","Black pepper","Turmeric",
  "Oregano","Thyme","Rosemary","Cayenne","Coriander",
  "Ginger","Cinnamon","Chili powder","Onion powder","Bay leaf",
];

const FLAVOR_PROFILES = [
  { id:"mediterranean", label:"Mediterranean", emoji:"🫒", color:"#1a7a4a", desc:"Olive oil, herbs, lemon — light & heart-healthy", keywords:"Mediterranean — bright, herby, citrusy. Think olive oil, lemon, oregano, garlic, fresh herbs." },
  { id:"bbq",           label:"BBQ",           emoji:"🔥", color:"#c8440c", desc:"Smoky, bold, caramelized — classic grill vibes",  keywords:"BBQ — smoky, bold, sweet heat. Think paprika, cumin, brown sugar notes, charred edges." },
  { id:"middleeastern", label:"Middle Eastern", emoji:"✨", color:"#c8840c", desc:"Warm spices, earthy depth, aromatic",              keywords:"Middle Eastern — warm and aromatic. Think cumin, coriander, turmeric, cinnamon, cardamom, pomegranate-like tang." },
  { id:"asian",         label:"Asian",          emoji:"🥢", color:"#9b2a5a", desc:"Umami-rich, ginger-forward, balanced sweet-salty", keywords:"Asian fusion — umami, ginger-forward, balanced. Think soy-like depth, ginger, sesame, five-spice warmth." },
  { id:"indian",        label:"Indian",         emoji:"🌶", color:"#c8640a", desc:"Bold spices, complex layers, aromatic heat",        keywords:"Indian-inspired — complex, aromatic, layered. Think garam masala warmth, turmeric, cumin, coriander, chili depth." },
  { id:"latin",         label:"Latin",          emoji:"🌮", color:"#2d7a3a", desc:"Zesty, vibrant, fresh with smoky undertones",       keywords:"Latin-inspired — zesty and vibrant. Think cumin, chili, lime brightness, smoky chipotle notes, fresh cilantro." },
];

const QUICK_VEGGIES = [
  "Broccoli","Bell peppers","Zucchini","Mushrooms","Onions",
  "Asparagus","Carrots","Cherry tomatoes","Spinach","Green beans",
  "Corn","Cauliflower","Sweet potato","Eggplant","Garlic cloves",
];

// ─── Theme ────────────────────────────────────────────────────────────────────
const T = {
  light: {
    pageBg:        "#fdf6ed",
    cardBg:        "#ffffff",
    cardBorder:    "#e8d5b8",
    inputBg:       "#ffffff",
    inputBorder:   "#e0c9a8",
    tagBg:         "#fff8e6",
    subBg:         "#fffdf7",
    mutedBg:       "#fff8f0",
    textPrimary:   "#2c1a0e",
    textSecondary: "#6b4a2a",
    textMuted:     "#8b6a4a",
    textFaint:     "#b89878",
    accent:        "#c8440c",
    accentLight:   "#e8650a",
    accentBg:      "rgba(200,68,12,0.08)",
    spiceColor:    "#8b6010",
    spiceBg:       "#fffbf0",
    spiceBorder:   "#e0a840",
    vegColor:      "#2d6e3a",
    vegBg:         "#eef7f0",
    vegBorder:     "#a8d4b0",
    vegInputBg:    "#f4faf5",
    shadow:        "0 4px 20px rgba(0,0,0,0.08)",
    shadowDeep:    "0 20px 80px rgba(0,0,0,0.1)",
    dotColor:      "#8b4513",
  },
  dark: {
    pageBg:        "#0d1117",
    cardBg:        "#161b24",
    cardBorder:    "#2a3040",
    inputBg:       "#111520",
    inputBorder:   "#3a4860",
    tagBg:         "#1e2230",
    subBg:         "#141820",
    mutedBg:       "#131720",
    textPrimary:   "#ffffff",
    textSecondary: "#f0d8a8",
    textMuted:     "#c8d8e8",
    textFaint:     "#90a8c4",
    accent:        "#ff7a2e",
    accentLight:   "#ffaa60",
    accentBg:      "rgba(255,122,46,0.12)",
    spiceColor:    "#f0c040",
    spiceBg:       "#1a1a08",
    spiceBorder:   "#9a7828",
    vegColor:      "#52d468",
    vegBg:         "#0a1e10",
    vegBorder:     "#286840",
    vegInputBg:    "#0c1c14",
    shadow:        "0 4px 24px rgba(0,0,0,0.5)",
    shadowDeep:    "0 20px 80px rgba(0,0,0,0.7)",
    dotColor:      "#3a4060",
  },
};

// ─── Background ───────────────────────────────────────────────────────────────
function Background({ dark }) {
  const t = dark ? T.dark : T.light;
  return (
    <div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,background:t.pageBg,transition:"background 0.5s"}}/>
      {!dark && <>
        <div style={{position:"absolute",top:"-8%",right:"-8%",width:650,height:650,borderRadius:"50%",background:"radial-gradient(circle,#f5e0c0 0%,transparent 65%)",opacity:0.5,animation:"orbFloat1 13s ease-in-out infinite"}}/>
        <div style={{position:"absolute",bottom:"-12%",left:"-8%",width:550,height:550,borderRadius:"50%",background:"radial-gradient(circle,#f0d4a8 0%,transparent 65%)",opacity:0.4,animation:"orbFloat2 17s ease-in-out infinite"}}/>
        <div style={{position:"absolute",top:"38%",left:"50%",transform:"translate(-50%,-50%)",width:900,height:900,borderRadius:"50%",background:"radial-gradient(circle,#fceeda 0%,transparent 55%)",opacity:0.7}}/>
        <div style={{position:"absolute",top:"62%",right:"8%",width:280,height:280,borderRadius:"50%",background:"radial-gradient(circle,#f5e0c0,transparent 70%)",opacity:0.45,animation:"orbFloat1 21s ease-in-out infinite reverse"}}/>
      </>}
      {dark && <>
        <div style={{position:"absolute",top:"-8%",right:"-8%",width:700,height:700,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,122,46,0.08) 0%,transparent 65%)",animation:"orbFloat1 14s ease-in-out infinite"}}/>
        <div style={{position:"absolute",bottom:"-12%",left:"-8%",width:620,height:620,borderRadius:"50%",background:"radial-gradient(circle,rgba(82,100,180,0.07) 0%,transparent 65%)",animation:"orbFloat2 19s ease-in-out infinite"}}/>
        <div style={{position:"absolute",top:"40%",left:"50%",transform:"translate(-50%,-50%)",width:1000,height:1000,borderRadius:"50%",background:"radial-gradient(circle,rgba(240,192,64,0.04) 0%,transparent 55%)"}}/>
        <div style={{position:"absolute",top:"68%",right:"5%",width:360,height:360,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,122,46,0.05),transparent 70%)",animation:"orbFloat2 24s ease-in-out infinite reverse"}}/>
      </>}
      <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:dark?0.022:0.04}}>
        <defs>
          <pattern id="dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="1.1" fill={t.dotColor}/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)"/>
      </svg>
    </div>
  );
}

// ─── Dark mode toggle button ──────────────────────────────────────────────────
function DarkToggle({ dark, onToggle }) {
  const t = dark ? T.dark : T.light;
  return (
    <button onClick={onToggle} style={{
      display:"flex",alignItems:"center",gap:7,
      background:"transparent",
      border:"none",
      borderRadius:99,padding:"10px 16px",cursor:"pointer",
      fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:14,fontWeight:700,
      color:t.textMuted,
      transition:"all 0.3s ease",
      letterSpacing:0.3,
      whiteSpace:"nowrap",
    }}
    onMouseEnter={e=>{e.currentTarget.style.color=t.accent;}}
    onMouseLeave={e=>{e.currentTarget.style.color=t.textMuted;}}
    >
      <span style={{fontSize:16,transition:"transform 0.4s",transform:dark?"rotate(180deg)":"rotate(0deg)",display:"inline-block"}}>
        {dark ? "☀️" : "🌙"}
      </span>
      <span>{dark ? "Light" : "Dark"}</span>
    </button>
  );
}

// ─── Step Header ──────────────────────────────────────────────────────────────
function StepHeader({ number, title, icon, t }) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:32}}>
      <div style={{
        width:40,height:40,borderRadius:12,flexShrink:0,
        background:`linear-gradient(135deg,${t.accent},${t.accentLight})`,
        display:"flex",alignItems:"center",justifyContent:"center",
        fontSize:16,fontWeight:900,color:"#fff",fontFamily:"'Playfair Display',serif",
        boxShadow:`0 4px 16px ${t.accent}55`,
      }}>{number}</div>
      <div>
        <p style={{fontSize:10,letterSpacing:3,color:t.accent,textTransform:"uppercase",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,marginBottom:2}}>Step {number}</p>
        <p style={{fontSize:20,fontFamily:"'Playfair Display',serif",fontWeight:700,color:t.textPrimary,letterSpacing:0.3}}>{icon} {title}</p>
      </div>
    </div>
  );
}

// ─── Tag ─────────────────────────────────────────────────────────────────────
function WarmTag({ label, onRemove, color, bg, t, bounce }) {
  const [h,setH]=useState(false);
  return (
    <span onClick={onRemove} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{
      display:"inline-flex",alignItems:"center",gap:7,
      background:h?color:bg,
      border:`1.5px solid ${h?color:color+"66"}`,
      color:h?"#fff":color,borderRadius:99,padding:"6px 14px",
      fontSize:14,fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:600,
      transition:"all 0.2s",cursor:"pointer",
      boxShadow:h?`0 4px 14px ${color}44`:"none",
      animation:bounce?"tagBounce 0.45s cubic-bezier(0.34,1.56,0.64,1) both":"none",
    }}>
      {label}
      <span style={{color:h?"rgba(255,255,255,0.8)":color+"88",fontSize:16,lineHeight:1,marginLeft:2}}>×</span>
    </span>
  );
}

// ─── Health Ring ──────────────────────────────────────────────────────────────
function HealthRing({ score, t }) {
  const [v,setV]=useState(0);
  useEffect(()=>{
    let n=0;const step=score/50;
    const t2=setInterval(()=>{n=Math.min(n+step,score);setV(Math.floor(n));if(n>=score)clearInterval(t2);},16);
    return ()=>clearInterval(t2);
  },[score]);
  const color = score>=80?"#2d7a3a":score>=60?"#c8840c":"#c8440c";
  const label = score>=80?"Excellent":score>=60?"Good":"Moderate";
  const emoji = score>=80?"🟢":score>=60?"🟡":"🔴";
  return (
    <div className="health-ring-wrap" style={{display:"flex",alignItems:"center",gap:24}}>
      <div style={{position:"relative",width:110,height:110,flexShrink:0}}>
        <svg width="110" height="110" style={{position:"absolute",top:0,left:0,transform:"rotate(-90deg)"}}>
          <circle cx="55" cy="55" r="46" fill="none" stroke={t.cardBorder} strokeWidth="9"/>
          <circle cx="55" cy="55" r="46" fill="none" stroke={color} strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={`${2*Math.PI*46}`}
            strokeDashoffset={`${2*Math.PI*46*(1-v/100)}`}
            style={{filter:`drop-shadow(0 0 6px ${color}66)`,transition:"stroke-dashoffset 0.05s"}}
          />
        </svg>
        <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
          <span style={{fontFamily:"'Playfair Display',serif",fontSize:32,fontWeight:700,color,lineHeight:1}}>{v}</span>
          <span style={{fontSize:12,color:t.textMuted,fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:600}}>/100</span>
        </div>
      </div>
      <div style={{flex:1}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
          <span style={{fontSize:20}}>{emoji}</span>
          <span style={{fontFamily:"'Playfair Display',serif",fontSize:28,fontWeight:700,color}}>{label}</span>
        </div>
        <div style={{background:t.cardBorder,borderRadius:99,height:12,overflow:"hidden",marginBottom:8,border:`1px solid ${t.inputBorder}`}}>
          <div style={{width:`${v}%`,height:"100%",borderRadius:99,background:`linear-gradient(90deg,${color}cc,${color})`,boxShadow:`0 0 10px ${color}55`,transition:"width 0.02s"}}/>
        </div>
        <span style={{fontSize:13,letterSpacing:2,fontWeight:700,color:t.textMuted,textTransform:"uppercase",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Health Score</span>
      </div>
    </div>
  );
}

// ─── Chef Mascot ──────────────────────────────────────────────────────────────
function ChefMascot({ score }) {
  const tier   = score>=80?"excellent":score>=60?"good":"moderate";
  const skin   = "#f5c49a";
  const white  = "#f8f8f8";
  const outline= "#d0a060";
  const hatCol = tier==="excellent"?"#2d7a3a":tier==="good"?"#c8840c":"#c8440c";
  const eyeCol = "#2a1a08";
  const blush  = tier==="excellent"?0.65:tier==="good"?0.35:0.15;

  const bodyAnim = tier==="excellent"
    ? "chefJump 0.75s cubic-bezier(0.34,1.56,0.64,1) infinite"
    : tier==="good"
    ? "chefBounce 1.6s ease-in-out infinite"
    : "chefWobble 2.2s ease-in-out infinite";

  const sparklePositions = [
    {x:8, y:22, s:6, delay:0,    col:"#f0c040"},
    {x:104,y:18, s:5, delay:0.28, col:"#52d468"},
    {x:5,  y:72, s:4, delay:0.55, col:"#ff7a2e"},
    {x:108,y:68, s:5, delay:0.18, col:"#f0c040"},
    {x:58, y:4,  s:4, delay:0.42, col:"#52d468"},
  ];

  return (
    <div style={{display:"flex",justifyContent:"center",alignItems:"flex-end",height:160,position:"relative",userSelect:"none"}}>
      <svg width="120" height="158" viewBox="0 0 120 158"
        style={{animation:bodyAnim, display:"block", overflow:"visible"}}
      >
        {/* ── Sparkles (excellent only) ── */}
        {tier==="excellent"&&sparklePositions.map((sp,i)=>(
          <g key={i} style={{animation:`sparkleOrbit 1.4s ease-in-out ${sp.delay}s infinite`, transformOrigin:`${sp.x}px ${sp.y}px`}}>
            <polygon
              points={`${sp.x},${sp.y-sp.s} ${sp.x+sp.s*0.35},${sp.y-sp.s*0.35} ${sp.x+sp.s},${sp.y} ${sp.x+sp.s*0.35},${sp.y+sp.s*0.35} ${sp.x},${sp.y+sp.s} ${sp.x-sp.s*0.35},${sp.y+sp.s*0.35} ${sp.x-sp.s},${sp.y} ${sp.x-sp.s*0.35},${sp.y-sp.s*0.35}`}
              fill={sp.col}
            />
          </g>
        ))}

        {/* ── Chef Hat ── */}
        {/* tall crown */}
        <rect x="34" y="14" width="52" height="46" rx="13" fill={white} stroke="#ddd" strokeWidth="1.5"/>
        {/* hat band */}
        <rect x="26" y="54" width="68" height="13" rx="6" fill={hatCol}/>
        {/* puff highlight on hat */}
        <ellipse cx="50" cy="28" rx="9" ry="14" fill="white" opacity="0.45"/>

        {/* ── Head ── */}
        <circle cx="60" cy="100" r="34" fill={skin} stroke={outline} strokeWidth="1.5"/>

        {/* ── Blush ── */}
        <ellipse cx="40" cy="108" rx="9" ry="6" fill="#f0806a" opacity={blush}/>
        <ellipse cx="80" cy="108" rx="9" ry="6" fill="#f0806a" opacity={blush}/>

        {/* ── Eyes ── */}
        <g style={{animation:"chefBlink 3.5s ease-in-out infinite", transformOrigin:"60px 95px"}}>
          <ellipse cx="47" cy="95" rx="5" ry={tier==="moderate"?"4.5":"5"} fill={eyeCol}/>
          <ellipse cx="73" cy="95" rx="5" ry={tier==="moderate"?"4.5":"5"} fill={eyeCol}/>
          {/* shine */}
          <circle cx="49.5" cy="92.5" r="1.8" fill="white"/>
          <circle cx="75.5" cy="92.5" r="1.8" fill="white"/>
        </g>

        {/* ── Eyebrows ── */}
        {tier==="excellent"&&<>
          <path d="M40 83 Q47 78 54 83" stroke={eyeCol} strokeWidth="2.8" fill="none" strokeLinecap="round"/>
          <path d="M66 83 Q73 78 80 83" stroke={eyeCol} strokeWidth="2.8" fill="none" strokeLinecap="round"/>
        </>}
        {tier==="good"&&<>
          <path d="M41 83 Q47 80 54 83" stroke={eyeCol} strokeWidth="2.8" fill="none" strokeLinecap="round"/>
          <path d="M66 83 Q73 80 80 83" stroke={eyeCol} strokeWidth="2.8" fill="none" strokeLinecap="round"/>
        </>}
        {tier==="moderate"&&<>
          <path d="M41 82 Q47 86 54 82" stroke={eyeCol} strokeWidth="2.8" fill="none" strokeLinecap="round"/>
          <path d="M66 82 Q73 86 80 82" stroke={eyeCol} strokeWidth="2.8" fill="none" strokeLinecap="round"/>
        </>}

        {/* ── Mouth ── */}
        {tier==="excellent"&&(
          <path d="M44 113 Q60 128 76 113" stroke={eyeCol} strokeWidth="2.5" fill="#e8607a" strokeLinecap="round" strokeLinejoin="round"/>
        )}
        {tier==="good"&&(
          <path d="M47 116 Q60 124 73 116" stroke={eyeCol} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        )}
        {tier==="moderate"&&(
          <path d="M47 118 Q60 113 73 118" stroke={eyeCol} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        )}

        {/* ── Body ── */}
        <rect x="22" y="128" width="76" height="28" rx="14" fill={white} stroke="#ddd" strokeWidth="1.5"/>
        {/* jacket center seam */}
        <line x1="60" y1="128" x2="60" y2="156" stroke="#e0e0e0" strokeWidth="1.2"/>
        {/* buttons */}
        <circle cx="53" cy="138" r="2.8" fill={hatCol}/>
        <circle cx="53" cy="149" r="2.8" fill={hatCol}/>
        <circle cx="67" cy="138" r="2.8" fill={hatCol}/>
        <circle cx="67" cy="149" r="2.8" fill={hatCol}/>

        {/* ── Arms ── */}
        {tier==="excellent"&&<>
          {/* Left arm up */}
          <path d="M22 138 Q5 118 12 96" stroke={white} strokeWidth="17" fill="none" strokeLinecap="round"/>
          <path d="M22 138 Q5 118 12 96" stroke="#ddd" strokeWidth="17" fill="none" strokeLinecap="round" opacity="0.5"/>
          {/* Right arm up */}
          <path d="M98 138 Q115 118 108 96" stroke={white} strokeWidth="17" fill="none" strokeLinecap="round"/>
          <path d="M98 138 Q115 118 108 96" stroke="#ddd" strokeWidth="17" fill="none" strokeLinecap="round" opacity="0.5"/>
          {/* Hands */}
          <circle cx="12" cy="94" r="10" fill={skin} stroke={outline} strokeWidth="1.5"/>
          <circle cx="108" cy="94" r="10" fill={skin} stroke={outline} strokeWidth="1.5"/>
          {/* Stars in hands */}
          <text x="6"   y="99" fontSize="11" textAnchor="middle">⭐</text>
          <text x="102" y="99" fontSize="11" textAnchor="middle">🌟</text>
        </>}

        {tier==="good"&&<>
          {/* Left arm relaxed */}
          <path d="M22 138 Q4 142 4 152" stroke={white} strokeWidth="16" fill="none" strokeLinecap="round"/>
          <path d="M22 138 Q4 142 4 152" stroke="#ddd" strokeWidth="16" fill="none" strokeLinecap="round" opacity="0.5"/>
          {/* Right arm — thumbs up */}
          <g style={{animation:"armWave 1.6s ease-in-out infinite", transformOrigin:"98px 138px"}}>
            <path d="M98 138 Q116 122 110 104" stroke={white} strokeWidth="16" fill="none" strokeLinecap="round"/>
            <path d="M98 138 Q116 122 110 104" stroke="#ddd" strokeWidth="16" fill="none" strokeLinecap="round" opacity="0.5"/>
            <circle cx="110" cy="102" r="10" fill={skin} stroke={outline} strokeWidth="1.5"/>
            <text x="104" y="107" fontSize="13">👍</text>
          </g>
          {/* Left hand */}
          <circle cx="4" cy="153" r="9" fill={skin} stroke={outline} strokeWidth="1.5"/>
        </>}

        {tier==="moderate"&&<>
          {/* Both arms shrug — out to sides */}
          <path d="M22 138 Q2 130 2 120" stroke={white} strokeWidth="16" fill="none" strokeLinecap="round"/>
          <path d="M22 138 Q2 130 2 120" stroke="#ddd" strokeWidth="16" fill="none" strokeLinecap="round" opacity="0.5"/>
          <path d="M98 138 Q118 130 118 120" stroke={white} strokeWidth="16" fill="none" strokeLinecap="round"/>
          <path d="M98 138 Q118 130 118 120" stroke="#ddd" strokeWidth="16" fill="none" strokeLinecap="round" opacity="0.5"/>
          {/* Shrug hands — palms up */}
          <circle cx="2"   cy="118" r="9" fill={skin} stroke={outline} strokeWidth="1.5"/>
          <circle cx="118" cy="118" r="9" fill={skin} stroke={outline} strokeWidth="1.5"/>
          {/* Question marks */}
          <text x="118" y="106" fontSize="13" textAnchor="middle">❓</text>
          <text x="2"   y="106" fontSize="13" textAnchor="middle">❓</text>
        </>}
      </svg>
    </div>
  );
}


function ParticleBurst({particles}) {
  const [phase, setPhase] = useState(false);
  useEffect(()=>{
    if(!particles.length){setPhase(false);return;}
    const id=requestAnimationFrame(()=>requestAnimationFrame(()=>setPhase(true)));
    return()=>cancelAnimationFrame(id);
  },[particles.length]);
  if(!particles.length) return null;
  return <>{particles.map(p=>(
    <div key={p.id} style={{
      position:"absolute",top:"50%",left:"50%",
      width:10,height:10,borderRadius:"50%",background:p.color,
      pointerEvents:"none",zIndex:10,marginLeft:-5,marginTop:-5,
      transform:phase?`translate(${p.dx}px,${p.dy}px) scale(0)`:"translate(0,0) scale(1)",
      opacity:phase?0:1,
      transition:phase?`transform 0.65s ease-out ${p.id*0.025}s,opacity 0.65s ease-out ${p.id*0.025}s`:"none",
    }}/>
  ))}</>;
}

// ─── Cooking Steps with timers ────────────────────────────────────────────────
function CookingSteps({ steps, t }) {
  const [done,   setDone]   = useState([]);
  const [hov,    setHov]    = useState(null);
  const [timers, setTimers] = useState({}); // {i: {remaining, running, initial}}
  const toggle = i => setDone(p=>p.includes(i)?p.filter(x=>x!==i):[...p,i]);

  function parseTime(text) {
    const m = text.match(/(\d+)\s*(?:to\s*\d+\s*)?(?:minutes?|mins?)/i);
    const s = text.match(/(\d+)\s*(?:seconds?|secs?)/i);
    if(m) return parseInt(m[1])*60;
    if(s) return parseInt(s[1]);
    return null;
  }
  function fmt(secs) {
    const m=Math.floor(secs/60), s=secs%60;
    return m>0?`${m}:${String(s).padStart(2,"0")}`:`0:${String(secs).padStart(2,"0")}`;
  }
  function startTimer(e, i, initial) {
    e.stopPropagation();
    setTimers(prev=>{
      const cur=prev[i]||{remaining:initial,running:false,initial};
      if(cur.remaining===0) return{...prev,[i]:{remaining:initial,running:true,initial}};
      return{...prev,[i]:{...cur,running:!cur.running}};
    });
  }
  function resetTimer(e, i, initial) {
    e.stopPropagation();
    setTimers(prev=>({...prev,[i]:{remaining:initial,running:false,initial}}));
  }

  useEffect(()=>{
    const id=setInterval(()=>{
      setTimers(prev=>{
        let changed=false;
        const next={...prev};
        Object.keys(next).forEach(k=>{
          if(next[k].running&&next[k].remaining>0){
            next[k]={...next[k],remaining:next[k].remaining-1};
            if(next[k].remaining===0) next[k]={...next[k],running:false};
            changed=true;
          }
        });
        return changed?next:prev;
      });
    },1000);
    return()=>clearInterval(id);
  },[]);

  if(!steps||steps.length===0) return null;
  const STEP_COLORS=["#c8440c","#c8840c","#c8640a","#2d7a3a","#1a6e8a","#9b2a5a","#7a4f12"];
  return (
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      {steps.map((step,i)=>{
        const isDone=done.includes(i), isHov=hov===i;
        const sc=STEP_COLORS[i%STEP_COLORS.length];
        const secs=parseTime(step);
        const timer=timers[i];
        const isRunning=timer?.running;
        const isDone0=timer?.remaining===0&&timer?.initial>0;
        return (
          <div key={i} onClick={()=>toggle(i)} onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)} style={{
            display:"flex",gap:14,alignItems:"flex-start",
            background:isDone?(t===T.dark?"#0a1e10":"#eef7ef"):isHov?t.accentBg:t.cardBg,
            border:`1.5px solid ${isDone?"#7abd8a":isHov?sc+"66":t.cardBorder}`,
            borderRadius:14,padding:"16px 18px",cursor:"pointer",
            transition:"all 0.25s ease",opacity:isDone?0.75:1,
            boxShadow:isDone?`0 2px 8px rgba(45,122,58,0.12)`:isHov?`0 4px 16px ${sc}22`:t.shadow,
          }}>
            <div style={{
              minWidth:38,height:38,borderRadius:10,flexShrink:0,marginTop:1,
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:isDone?18:16,fontWeight:800,fontFamily:"'Playfair Display',serif",
              transition:"all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
              transform:isHov&&!isDone?"scale(1.18) rotate(-4deg)":"scale(1)",
              background:isDone?"linear-gradient(135deg,#4caf63,#2d7a3a)":`linear-gradient(135deg,${sc},${sc}cc)`,
              color:"#fff",boxShadow:isDone?"0 4px 14px rgba(45,122,58,0.4)":`0 4px 12px ${sc}55`,
            }}>{isDone?"✓":i+1}</div>
            <div style={{flex:1}}>
              <p style={{color:isDone?(t===T.dark?"#4ab870":"#4a7a52"):t.textPrimary,fontSize:15,lineHeight:1.75,fontWeight:isDone?400:500,textDecoration:isDone?"line-through":"none",transition:"all 0.25s",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{step}</p>
              {secs&&(
                <div onClick={e=>e.stopPropagation()} style={{
                  marginTop:12,borderRadius:14,overflow:"hidden",
                  border:`2px solid ${isDone0?"#2d7a3a":isRunning?sc:t.cardBorder}`,
                  background:isDone0?(t===T.dark?"rgba(45,122,58,0.12)":"#f0faf2"):isRunning?`${sc}0e`:t.mutedBg,
                  transition:"all 0.3s",
                }}>
                  {/* Timer display row */}
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 16px",gap:12}}>
                    {/* Big countdown */}
                    <div style={{display:"flex",alignItems:"baseline",gap:4}}>
                      <span style={{
                        fontFamily:"'Playfair Display',serif",
                        fontSize:32,fontWeight:900,letterSpacing:1,lineHeight:1,
                        color:isDone0?"#2d7a3a":isRunning?sc:t.textMuted,
                        transition:"color 0.3s",
                        fontVariantNumeric:"tabular-nums",
                      }}>
                        {timer?fmt(timer.remaining):fmt(secs)}
                      </span>
                      <span style={{fontSize:13,color:isDone0?"#2d7a3a":isRunning?sc:t.textFaint,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif",marginLeft:4}}>
                        {isDone0?"Done!":isRunning?"remaining":"timer"}
                      </span>
                    </div>
                    {/* Controls */}
                    <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
                      {timer&&timer.remaining!==secs&&(
                        <button onClick={e=>resetTimer(e,i,secs)} style={{
                          background:"none",border:`1.5px solid ${t.cardBorder}`,
                          borderRadius:8,padding:"6px 10px",cursor:"pointer",
                          fontSize:13,color:t.textMuted,fontWeight:600,
                          fontFamily:"'Plus Jakarta Sans',sans-serif",
                          transition:"all 0.2s",
                        }}
                        onMouseEnter={e=>{e.target.style.borderColor=sc;e.target.style.color=sc;}}
                        onMouseLeave={e=>{e.target.style.borderColor=t.cardBorder;e.target.style.color=t.textMuted;}}>
                          ↺
                        </button>
                      )}
                      <button onClick={e=>startTimer(e,i,secs)} style={{
                        display:"flex",alignItems:"center",gap:7,
                        background:isDone0?"#2d7a3a":isRunning?`${sc}cc`:`linear-gradient(135deg,${sc},${sc}cc)`,
                        border:"none",borderRadius:10,
                        padding:"8px 18px",cursor:"pointer",
                        fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:14,fontWeight:700,
                        color:"#fff",transition:"all 0.2s",
                        boxShadow:isRunning?`0 4px 16px ${sc}55`:isDone0?"0 4px 16px #2d7a3a55":"none",
                        opacity:isDone0?0.8:1,
                      }}>
                        <span style={{fontSize:16}}>{isDone0?"✅":isRunning?"⏸":"▶"}</span>
                        <span>{isDone0?"Done":isRunning?"Pause":"Start"}</span>
                      </button>
                    </div>
                  </div>
                  {/* Progress bar */}
                  {timer&&(
                    <div style={{height:4,background:t.cardBorder}}>
                      <div style={{
                        height:"100%",
                        width:`${((timer.initial-timer.remaining)/timer.initial)*100}%`,
                        background:isDone0?"#2d7a3a":`linear-gradient(90deg,${sc},${sc}cc)`,
                        transition:"width 1s linear",
                        boxShadow:isDone0?"0 0 8px #2d7a3a88":`0 0 8px ${sc}88`,
                      }}/>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div style={{fontSize:12,flexShrink:0,marginTop:4,letterSpacing:1,textTransform:"uppercase",fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif",transition:"opacity 0.2s",color:isDone?"#2d7a3a":isHov?sc:t.textFaint,opacity:isDone||isHov?1:0}}>
              {isDone?"Done ✓":"Mark"}
            </div>
          </div>
        );
      })}
      <div style={{marginTop:8,padding:"14px 16px",background:t.mutedBg,borderRadius:12,border:`1px solid ${t.cardBorder}`}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:8,alignItems:"center"}}>
          <span style={{fontSize:12,color:t.textMuted,fontFamily:"'Plus Jakarta Sans',sans-serif",letterSpacing:1.5,textTransform:"uppercase",fontWeight:700}}>Progress</span>
          <span style={{fontSize:15,fontFamily:"'Playfair Display',serif",fontWeight:700,color:done.length===steps.length?"#2d7a3a":t.accent}}>
            {done.length}/{steps.length} {done.length===steps.length?"— 🎉 All Done!":"steps"}
          </span>
        </div>
        <div style={{background:t.cardBorder,borderRadius:99,height:10,overflow:"hidden",border:`1px solid ${t.inputBorder}`}}>
          <div style={{width:`${(done.length/steps.length)*100}%`,height:"100%",borderRadius:99,background:done.length===steps.length?"linear-gradient(90deg,#4caf63,#2d7a3a)":`linear-gradient(90deg,${t.accent},${t.accentLight})`,boxShadow:done.length===steps.length?"0 0 12px #2d7a3a88":`0 0 10px ${t.accent}88`,transition:"width 0.4s ease"}}/>
        </div>
      </div>
    </div>
  );
}

// ─── Shopping List Modal ──────────────────────────────────────────────────────
function ShoppingList({ result, meatLabel, veggies, servings, dark, t, onClose }) {
  const [checked, setChecked] = useState({});
  const [copied, setCopied] = useState(false);

  const toggle = key => setChecked(p=>({...p,[key]:!p[key]}));

  const sections = [
    {
      title:"🥩 Protein",
      color:"#c8440c",
      items:[{name:meatLabel, amount:`for ${servings} ${servings===1?"person":"people"}`}]
    },
    {
      title:"🌶 Spices & Seasonings",
      color:dark?"#f0c040":"#c8840c",
      items:(result.spice_mix||[]).map(s=>({name:s.spice, amount:s.amount}))
    },
    ...(veggies.length>0?[{
      title:"🥦 Vegetables",
      color:dark?"#52d468":"#2d7a3a",
      items:veggies.map(v=>({name:v, amount:"as needed"}))
    }]:[]),
  ];

  function copyList() {
    const lines = [
      `🛒 Shopping List — ${result.recipe_name}`,
      `Serves ${servings} ${servings===1?"person":"people"}`,
      "",
      ...sections.flatMap(s=>[
        s.title,
        ...s.items.map(i=>`  • ${i.amount} ${i.name}`),
        ""
      ]),
      "Made with SpiceSight ✨"
    ].join("\n");
    navigator.clipboard.writeText(lines).then(()=>{
      setCopied(true);
      setTimeout(()=>setCopied(false), 2500);
    }).catch(()=>{});
  }

  const totalItems = sections.reduce((a,s)=>a+s.items.length,0);
  const checkedCount = Object.values(checked).filter(Boolean).length;

  return (
    <div style={{
      position:"fixed",inset:0,zIndex:9999,
      background:"rgba(0,0,0,0.6)",backdropFilter:"blur(6px)",
      display:"flex",alignItems:"flex-end",justifyContent:"center",
      animation:"fadeUp 0.2s ease both",
    }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{
        width:"100%",maxWidth:600,maxHeight:"85vh",
        background:dark?"#161b24":"#fff",
        borderRadius:"24px 24px 0 0",
        boxShadow:"0 -8px 48px rgba(0,0,0,0.4)",
        display:"flex",flexDirection:"column",
        overflow:"hidden",
        animation:"slideInUp 0.35s cubic-bezier(0.34,1.56,0.64,1) both",
      }}>
        {/* Header */}
        <div style={{
          padding:"20px 24px 16px",
          borderBottom:`1.5px solid ${t.cardBorder}`,
          display:"flex",alignItems:"center",justifyContent:"space-between",
          flexShrink:0,
        }}>
          <div>
            <p style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:900,color:t.textPrimary,marginBottom:4}}>🛒 Shopping List</p>
            <p style={{fontSize:13,color:t.textMuted,fontWeight:600}}>{result.recipe_name} · {checkedCount}/{totalItems} items</p>
          </div>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            <button onClick={copyList} style={{
              background:copied?"#2d7a3a":t.accentBg,border:`1.5px solid ${copied?"#2d7a3a":t.accent}`,
              borderRadius:99,padding:"8px 16px",cursor:"pointer",
              fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,fontWeight:700,
              color:copied?"#fff":t.accent,transition:"all 0.2s",
            }}>
              {copied?"✓ Copied!":"📋 Copy"}
            </button>
            <button onClick={onClose} style={{
              width:36,height:36,borderRadius:"50%",border:`1.5px solid ${t.cardBorder}`,
              background:t.mutedBg,cursor:"pointer",fontSize:18,color:t.textMuted,
              display:"flex",alignItems:"center",justifyContent:"center",
            }}>×</button>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{height:4,background:t.cardBorder,flexShrink:0}}>
          <div style={{
            height:"100%",
            width:`${totalItems>0?(checkedCount/totalItems)*100:0}%`,
            background:`linear-gradient(90deg,${t.accent},${t.accentLight})`,
            transition:"width 0.4s cubic-bezier(0.34,1.56,0.64,1)",
          }}/>
        </div>

        {/* Items */}
        <div style={{overflowY:"auto",padding:"16px 24px 32px",flex:1}}>
          {sections.map((section,si)=>(
            <div key={si} style={{marginBottom:24}}>
              <p style={{fontSize:12,letterSpacing:2,fontWeight:800,color:section.color,textTransform:"uppercase",marginBottom:12,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{section.title}</p>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {section.items.map((item,ii)=>{
                  const key=`${si}-${ii}`;
                  const done=!!checked[key];
                  const affiliateTag = "spicesight-20"; // replace with your Amazon affiliate tag
                  const amazonUrl = `https://www.amazon.com/s?k=${encodeURIComponent(item.name+"+spice")}&tag=${affiliateTag}`;
                  return (
                    <div key={key} style={{
                      display:"flex",alignItems:"center",gap:14,
                      padding:"14px 16px",borderRadius:14,
                      background:done?`${section.color}10`:t.inputBg,
                      border:`1.5px solid ${done?section.color:t.cardBorder}`,
                      transition:"all 0.2s",
                      opacity:done?0.6:1,
                    }}>
                      <div onClick={()=>toggle(key)} style={{
                        width:24,height:24,borderRadius:"50%",flexShrink:0,cursor:"pointer",
                        border:`2px solid ${done?section.color:t.cardBorder}`,
                        background:done?section.color:"transparent",
                        display:"flex",alignItems:"center",justifyContent:"center",
                        transition:"all 0.2s",
                      }}>
                        {done&&<span style={{fontSize:13,color:"#fff",fontWeight:900}}>✓</span>}
                      </div>
                      <div onClick={()=>toggle(key)} style={{flex:1,cursor:"pointer"}}>
                        <p style={{fontSize:15,fontWeight:700,color:t.textPrimary,textDecoration:done?"line-through":"none",transition:"all 0.2s"}}>{item.name}</p>
                        <p style={{fontSize:12,color:t.textMuted,fontWeight:500,marginTop:2}}>{item.amount}</p>
                      </div>
                      <a href={amazonUrl} target="_blank" rel="noopener noreferrer"
                        onClick={e=>e.stopPropagation()}
                        style={{
                          display:"flex",alignItems:"center",gap:5,
                          background:"#ff9900",border:"none",borderRadius:99,
                          padding:"6px 12px",cursor:"pointer",textDecoration:"none",
                          fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:12,fontWeight:700,
                          color:"#fff",flexShrink:0,
                          boxShadow:"0 2px 8px rgba(255,153,0,0.4)",
                          transition:"all 0.2s",
                        }}
                        onMouseEnter={e=>e.currentTarget.style.transform="scale(1.05)"}
                        onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
                      >
                        🛍 Buy
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          {checkedCount===totalItems&&totalItems>0&&(
            <div style={{textAlign:"center",padding:"20px 0"}}>
              <div style={{fontSize:48,marginBottom:8}}>🎉</div>
              <p style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:"#2d7a3a"}}>All items checked!</p>
              <p style={{fontSize:14,color:t.textMuted,marginTop:4}}>Time to cook! 👨‍🍳</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function SpiceSight() {
  const [dark,          setDark]          = useState(false);
  const [selectedMeats, setSelectedMeats] = useState([]);
  const [customMeat,    setCustomMeat]    = useState("");
  const [selectedMethod,setSelectedMethod]= useState("Oven");
  const [customMethod,  setCustomMethod]  = useState("");
  const [spices,        setSpices]        = useState([]);
  const [spiceInput,    setSpiceInput]    = useState("");
  const [veggies,       setVeggies]       = useState([]);
  const [veggieInput,   setVeggieInput]   = useState("");
  const [veggieStyle,   setVeggieStyle]   = useState("with");
  const [result,        setResult]        = useState(null);
  const [loading,       setLoading]       = useState(false);
  const [loadingMsg,    setLoadingMsg]    = useState("");
  const [error,         setError]         = useState(null);
  const [favorites,     setFavorites]     = useState([]);
  const [activeTab,     setActiveTab]     = useState("create");
  const [expandedFav,   setExpandedFav]   = useState(null);
  const [savedToast,    setSavedToast]    = useState(false);
  const [isSaved,       setIsSaved]       = useState(false);
  const [surpriseMode,  setSurpriseMode]  = useState(false);
  const [surpriseProtein,setSurpriseProtein]=useState("");
  const [flavorProfile, setFlavorProfile] = useState(null);
  const [screen,        setScreen]        = useState("form"); // "form" | "results"
  const [flippingMeat,  setFlippingMeat]  = useState(null);
  const [bouncingTag,   setBouncingTag]   = useState(null);
  const [diceRolling,   setDiceRolling]   = useState(false);
  const [particles,     setParticles]     = useState([]);
  const [servings,      setServings]      = useState(2);
  const [libSearch,     setLibSearch]     = useState("");
  const [shareToast,    setShareToast]    = useState(false);
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [checkedItems,  setCheckedItems]  = useState({});

  // ─── Step refs for auto-advance ───────────────────────────────────────────
  const refMethod   = useRef(null);
  const refSpices   = useRef(null);
  const refVeggies  = useRef(null);
  const refFlavor   = useRef(null);
  const refGenerate = useRef(null);

  function scrollToStep(ref, delay=360) {
    setTimeout(()=>{
      if(ref?.current) {
        ref.current.scrollIntoView({behavior:"smooth", block:"start"});
      }
    }, delay);
  }

  // Computed step progress (0–5 in normal mode, 0–4 in surprise mode)
  // ─── Meat helpers (needed early for progress bar) ─────────────────────────
  const hasCustomMeat  = customMeat.trim().length > 0;
  const hasMeat        = selectedMeats.length > 0 || hasCustomMeat;
  const allMeatLabels  = [
    ...selectedMeats.map(id=>MEATS.find(m=>m.id===id)?.label).filter(Boolean),
    ...(hasCustomMeat?[customMeat.trim()]:[]),
  ];

  const formSteps = surpriseMode
    ? ["Spices","Veggies","Flavor","Servings"]
    : ["Meat","Method","Spices","Veggies","Flavor"];
  const formDone = surpriseMode
    ? [spices.length>0, true, true, true]
    : [hasMeat, selectedMethod!==null, spices.length>0, true, true];
  const stepsDone = formDone.filter(Boolean).length;
  const resultRef = useRef(null);
  const t = dark ? T.dark : T.light;

  // Ensure proper mobile viewport — no zoom, fits all screens
  useEffect(()=>{
    let meta = document.querySelector('meta[name="viewport"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = 'viewport'; document.head.appendChild(meta); }
    meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
  }, []);

  // Load favorites from persistent storage on mount
  useEffect(()=>{
    (async()=>{
      try {
        const res = await window.storage.get("spicesight-favorites");
        if(res?.value) setFavorites(JSON.parse(res.value));
      } catch {}
    })();
  },[]);

  // Reset isSaved when result changes
  useEffect(()=>{ setIsSaved(false); },[result]);

  async function saveFavorite() {
    if(!result||isSaved) return;
    const entry = {
      id: Date.now(),
      savedAt: new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}),
      meat: meatLabel,
      meatColor: meatColor,
      method: methodLabel,
      spices:[...spices],
      veggies:[...veggies],
      ...result,
    };
    const updated = [entry, ...favorites];
    setFavorites(updated);
    setIsSaved(true);
    setSavedToast(true);
    setTimeout(()=>setSavedToast(false), 2800);
    try { await window.storage.set("spicesight-favorites", JSON.stringify(updated)); } catch {}
  }

  async function deleteFavorite(id) {
    const updated = favorites.filter(f=>f.id!==id);
    setFavorites(updated);
    if(expandedFav===id) setExpandedFav(null);
    try { await window.storage.set("spicesight-favorites", JSON.stringify(updated)); } catch {}
  }

  useEffect(()=>{
    if(!loading) return;
    const msgs = surpriseMode
      ? ["Analyzing your spices...","Picking the perfect protein...","Crafting your surprise meal...","Almost ready..."]
      : ["Analyzing your spices...","Crafting the blend...","Scoring health benefits...","Almost ready..."];
    let i=0;setLoadingMsg(msgs[0]);
    const timer=setInterval(()=>{i=(i+1)%msgs.length;setLoadingMsg(msgs[i]);},900);
    return ()=>clearInterval(timer);
  },[loading]);

  const addSpice  = s=>{const c=s.trim();if(c&&!spices.includes(c)){setSpices(p=>[...p,c]);setBouncingTag(c);setTimeout(()=>setBouncingTag(null),500);}};
  const addVeggie = s=>{const c=s.trim();if(c&&!veggies.includes(c))setVeggies(p=>[...p,c]);};
  const onSpiceKey  = e=>{if(e.key==="Enter"||e.key===","){e.preventDefault();addSpice(spiceInput);  setSpiceInput("");}};
  const onVeggieKey = e=>{if(e.key==="Enter"||e.key===","){e.preventDefault();addVeggie(veggieInput);setVeggieInput("");}};

  const meatLabel  = surpriseMode?(result?.chosen_protein||"?"):allMeatLabels.join(" & ")||"";
  const meatColor  = surpriseMode?t.accent:(MEATS.find(m=>m.id===selectedMeats[0])?.color||t.accent);
  const methodLabel= surpriseMode?(result?.chosen_method||"?"):(selectedMethod==="custom"?customMethod:selectedMethod);

  const canGenerate = surpriseMode
    ? spices.length>0&&!loading
    : hasMeat&&spices.length>0&&!loading
      &&!(selectedMeats.length===0&&!hasCustomMeat)
      &&!(selectedMethod==="custom"&&!customMethod.trim());

  function fireParticles() {
    const ps = Array.from({length:12},(_,i)=>({id:i,dx:(Math.random()-0.5)*140,dy:(Math.random()-1.2)*120,color:[t.accent,t.accentLight,"#f0c0b0","#e08080","#c04060"][i%5]}));
    setParticles(ps);
    setTimeout(()=>setParticles([]),700);
  }

  function shareRecipe() {
    if(!result) return;
    const lines = [
      `🌶 ${result.recipe_name}`,
      `🍖 ${meatLabel}  ·  🔥 ${methodLabel}  ·  👥 Serves ${servings}`,
      `💚 Health Score: ${result.health_score}/100`,
      ``,
      `🧂 Spice Mix:`,
      ...(result.spice_mix||[]).map(s=>`  • ${s.amount} ${s.spice} — ${s.role}`),
      ``,
      `👨‍🍳 Instructions:`,
      ...(result.cooking_instructions||[]).map((s,i)=>`  ${i+1}. ${s}`),
      ``,
      `💡 Pro Tip: ${result.pro_tip}`,
      ``,
      `Made with SpiceSight ✨`,
    ].join("\n");
    navigator.clipboard.writeText(lines).then(()=>{
      setShareToast(true);
      setTimeout(()=>setShareToast(false),2500);
    }).catch(()=>{});
  }

  async function generate() {
    fireParticles();
    setLoading(true);setError(null);setResult(null);
    const veggieNote=veggies.length>0?`\nVegetables: ${veggies.join(", ")} — cook ${veggieStyle==="with"?"WITH the meat":"separately ON THE SIDE"}.`:"";
    const veggieJsonField=veggies.length>0?`,"veggie_prep":{"style":"${veggieStyle==="with"?"With the Meat":"On the Side"}","instructions":["Step 1","Step 2","Step 3"],"tip":"One veggie tip"}`:"";

    const fp = FLAVOR_PROFILES.find(f=>f.id===flavorProfile);
    const flavorNote = fp ? `\nFlavor direction: ${fp.keywords}` : "";

    let prompt;
    if(surpriseMode){
      const proteinHint=surpriseProtein.trim()?`The user has this protein available: ${surpriseProtein.trim()}. Use it.`:`Choose the healthiest protein that pairs best with these spices.`;
      prompt=`You are an expert culinary nutritionist and chef. ${proteinHint}
Available spices: ${spices.join(", ")}${veggieNote}${flavorNote}
Servings: ${servings} people — scale all ingredient amounts accordingly.
Based ONLY on these spices, decide the best protein and cooking method to create the healthiest, most delicious meal possible.
Return ONLY valid JSON:
{"recipe_name":"Creative name","chosen_protein":"e.g. Chicken Thighs","chosen_method":"e.g. Pan-Fry","ai_reasoning":"2 sentences explaining WHY you chose this protein and method based on the spices.","health_score":85,"health_notes":"2 sentences about health benefits.","spice_mix":[{"spice":"name","amount":"1 tsp","role":"role in 5 words"}],"marinate_time":"30 minutes","cooking_instructions":["Step 1","Step 2","Step 3","Step 4","Step 5"]${veggieJsonField},"pro_tip":"One chef tip.","flavor_profile":"e.g. Smoky & Earthy"}
Only use spices from the provided list. Prioritize health and flavor synergy.${veggies.length>0?" Provide detailed veggie prep.":""}`;
    } else {
      prompt=`You are an expert culinary nutritionist and chef. Season ${meatLabel} using ${selectedMethod==="custom"?customMethod:selectedMethod} method.${allMeatLabels.length>1?` This is a multi-protein dish combining ${meatLabel} — create a unified recipe that works for all.`:""}
Available spices: ${spices.join(", ")}${veggieNote}${flavorNote}
Servings: ${servings} people — scale all ingredient amounts accordingly.
Return ONLY valid JSON:
{"recipe_name":"Creative name","health_score":85,"health_notes":"2 sentences about health benefits.","spice_mix":[{"spice":"name","amount":"1 tsp","role":"role in 5 words"}],"marinate_time":"30 minutes","cooking_instructions":["Step 1","Step 2","Step 3","Step 4","Step 5"]${veggieJsonField},"pro_tip":"One chef tip.","flavor_profile":"e.g. Smoky & Earthy"}
Only use spices from provided list. Prioritize health.${veggies.length>0?" Provide detailed veggie prep.":""}${allMeatLabels.length>1?" Acknowledge the multi-protein combination in the recipe name.":""}`;
    }
    try {
      const res=await fetch("/api/generate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1600,messages:[{role:"user",content:prompt}]})});
      const data=await res.json();
      const raw=data.content?.map(b=>b.text||"").join("")||"";
      const parsed=JSON.parse(raw.match(/\{[\s\S]*\}/)[0]);
      setResult(parsed);
      setScreen("results");
      window.scrollTo({top:0,behavior:"instant"});
    } catch {setError("Something went wrong. Please try again.");}
    finally{setLoading(false);}
  }

  // Go back to form keeping all selections intact
  function goBack() {
    setResult(null);
    setScreen("form");
    window.scrollTo({top:0,behavior:"instant"});
  }

  // Full reset — clears everything
  function fullReset() {
    setResult(null);setSelectedMeats([]);setCustomMeat("");
    setSelectedMethod("Oven");setCustomMethod("");
    setSpices([]);setSpiceInput("");
    setVeggies([]);setVeggieInput("");setVeggieStyle("with");
    setSurpriseProtein("");setFlavorProfile(null);setServings(2);
    setScreen("form");
    window.scrollTo({top:0,behavior:"instant"});
  }

  // ─── Inline style helpers ──────────────────────────────────────────────────
  const cardStyle = {
    background:t.cardBg,border:`1.5px solid ${t.cardBorder}`,borderRadius:22,
    boxShadow:t.shadow,transition:"background 0.4s,border-color 0.4s",
  };
  const inputStyle = {
    width:"100%",background:t.inputBg,border:`2px solid ${t.inputBorder}`,
    borderRadius:14,padding:"15px 20px",color:t.textPrimary,
    fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:16,fontWeight:500,
    outline:"none",transition:"all 0.25s",
  };
  const veggieInputStyle = {
    ...inputStyle, background:dark?"#0e1e12":"#fff",
    border:`2px solid ${t.vegBorder}`,color:t.vegColor,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth;-webkit-text-size-adjust:100%;text-size-adjust:100%}
        body{background:${t.pageBg};transition:background 0.5s;overflow-x:hidden;font-family:'Plus Jakarta Sans',sans-serif}
        input::placeholder{color:${dark?"#6a7a9a":"#b89878"};opacity:1}
        input{color:${t.textPrimary}}
        ::selection{background:${t.accent}40}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:linear-gradient(180deg,${t.accent},${t.accentLight});border-radius:99px}
        @keyframes slideInRight{from{opacity:0;transform:translateX(52px)}to{opacity:1;transform:translateX(0)}}
        @keyframes slideInLeft{from{opacity:0;transform:translateX(-52px)}to{opacity:1;transform:translateX(0)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
        @keyframes warmPulse{0%,100%{box-shadow:0 6px 32px ${t.accent}44}50%{box-shadow:0 12px 52px ${t.accent}77}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes shimmer{0%{background-position:200% center}100%{background-position:-200% center}}
        @keyframes pulse{0%,100%{transform:scale(1);opacity:0.45}50%{transform:scale(1.5);opacity:1}}
        @keyframes toastIn{0%{opacity:0;transform:translateY(28px) scale(0.92)}100%{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes toastOut{0%{opacity:1}100%{opacity:0}}
        @keyframes float{0%,100%{transform:translateY(0px)}50%{transform:translateY(-10px)}}
        @keyframes titleGlow{0%,100%{filter:drop-shadow(0 0 10px ${t.accent}33)}50%{filter:drop-shadow(0 0 24px ${t.accent}77)}}
        @keyframes orbFloat1{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(30px,-20px) scale(1.05)}66%{transform:translate(-15px,15px) scale(0.97)}}
        @keyframes orbFloat2{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(-25px,18px) scale(1.03)}66%{transform:translate(20px,-12px) scale(0.98)}}
        @keyframes badgePop{from{opacity:0;transform:scale(0.8) translateY(6px)}to{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes cardFlip{0%{transform:rotateY(0deg)}40%{transform:rotateY(-20deg) scale(1.06)}70%{transform:rotateY(8deg) scale(1.03)}100%{transform:rotateY(0deg) scale(1)}}
        @keyframes tagBounce{0%{transform:scale(1)}30%{transform:scale(1.18) translateY(-4px)}60%{transform:scale(0.95) translateY(2px)}100%{transform:scale(1) translateY(0)}}
        @keyframes diceRoll{0%{transform:rotate(0deg) scale(1)}20%{transform:rotate(-30deg) scale(1.3)}45%{transform:rotate(25deg) scale(1.2)}65%{transform:rotate(-15deg) scale(1.15)}80%{transform:rotate(8deg) scale(1.08)}100%{transform:rotate(0deg) scale(1)}}
        @keyframes particleFly{0%{transform:translate(0,0) scale(1);opacity:1}100%{transform:translate(var(--dx),var(--dy)) scale(0);opacity:0}}
        @keyframes shimmerGold{0%{background-position:-200% 0}100%{background-position:200% 0}}
        @keyframes modeSlide{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
        @keyframes chefJump{0%,100%{transform:translateY(0) rotate(-1deg)}30%{transform:translateY(-20px) rotate(2deg)}60%{transform:translateY(-26px) rotate(-2deg)}80%{transform:translateY(-14px) rotate(1deg)}}
        @keyframes slideInUp{from{opacity:0;transform:translateY(100%)}to{opacity:1;transform:translateY(0)}}
        @keyframes chefBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes chefWobble{0%,100%{transform:rotate(0deg) translateY(0)}25%{transform:rotate(-7deg) translateY(2px)}75%{transform:rotate(7deg) translateY(2px)}}
        @keyframes chefBlink{0%,88%,100%{transform:scaleY(1)}92%,96%{transform:scaleY(0.08)}}
        @keyframes sparkleOrbit{0%{opacity:0;transform:scale(0) rotate(0deg)}20%{opacity:1;transform:scale(1.3) rotate(60deg)}60%{opacity:1;transform:scale(1) rotate(200deg)}100%{opacity:0;transform:scale(0) rotate(360deg)}}
        @keyframes armWave{0%,100%{transform:rotate(0deg)}50%{transform:rotate(-25deg)}}
        .title-gradient{
          background:linear-gradient(135deg,${dark?"#ffaa60":"#a83010"} 0%,${dark?"#ff7a2e":"#c8440c"} 45%,${dark?"#f0c040":"#e8650a"} 100%);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
          animation:titleGlow 3s ease-in-out infinite;
        }
        .card-hover{transition:transform 0.25s ease,box-shadow 0.25s ease}
        .card-hover:hover{transform:translateY(-3px);box-shadow:${t.shadowDeep}}
        .spice-amount-shimmer:hover{background:linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.4) 50%,transparent 100%) !important;background-size:200% 100% !important;animation:shimmerGold 1.2s ease infinite !important}
        .rc{animation:fadeUp 0.5s ease both}
        .rc:nth-child(1){animation-delay:0.05s}.rc:nth-child(2){animation-delay:0.13s}
        .rc:nth-child(3){animation-delay:0.21s}.rc:nth-child(4){animation-delay:0.29s}
        .rc:nth-child(5){animation-delay:0.37s}.rc:nth-child(6){animation-delay:0.45s}
        .rc:nth-child(7){animation-delay:0.53s}.rc:nth-child(8){animation-delay:0.61s}
        .rc:nth-child(9){animation-delay:0.69s}
        @media (max-width:480px){
          .marinate-grid{grid-template-columns:1fr !important}
          .veggie-toggle{grid-template-columns:1fr !important}
          .step-hint{display:none !important}
          .recipe-tags{gap:6px !important}
          .recipe-tags span{font-size:12px !important;padding:5px 10px !important}
          .health-ring-wrap{flex-direction:column;align-items:flex-start !important;gap:16px !important}
        }
        @media (max-width:360px){
          .spice-row{flex-direction:column;align-items:flex-start !important}
          .spice-amount{min-width:unset !important;width:100% !important}
        }
      `}</style>

      <Background dark={dark}/>

      <div style={{minHeight:"100vh",padding:"24px 14px 80px",position:"relative",zIndex:1,fontFamily:"'Plus Jakarta Sans',sans-serif",color:t.textPrimary,transition:"color 0.4s"}}>
        <div style={{maxWidth:1200,margin:"0 auto",width:"100%"}}>

          {/* ── TOP BAR: tabs + dark toggle — always visible ── */}
          <div style={{display:"flex",justifyContent:"center",alignItems:"center",marginBottom:24}}>
            <div style={{display:"flex",alignItems:"center",background:dark?"rgba(22,18,16,0.9)":"rgba(255,255,255,0.9)",border:`1.5px solid ${t.cardBorder}`,borderRadius:99,padding:5,gap:4,boxShadow:t.shadow,backdropFilter:"blur(12px)"}}>
              {[{id:"create",icon:"✦",label:"New Recipe"},{id:"library",icon:"📚",label:`My Recipes${favorites.length>0?` (${favorites.length})`:""}`}].map(tab=>{
                const active=activeTab===tab.id;
                return (
                  <button key={tab.id} onClick={()=>setActiveTab(tab.id)} style={{display:"flex",alignItems:"center",gap:7,padding:"10px 18px",borderRadius:99,border:"none",cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:14,fontWeight:700,background:active?`linear-gradient(135deg,${t.accent},${t.accentLight})`:"transparent",color:active?"#fff":t.textMuted,transition:"all 0.3s ease",boxShadow:active?`0 4px 18px ${t.accent}55`:"none",letterSpacing:0.3}}>
                    <span style={{fontSize:14}}>{tab.icon}</span>{tab.label}
                  </button>
                );
              })}
              <div style={{width:"1.5px",height:24,background:t.cardBorder,margin:"0 4px",flexShrink:0}}/>
              <DarkToggle dark={dark} onToggle={()=>setDark(d=>!d)}/>
            </div>
          </div>
          {/* ── LIBRARY VIEW ── */}
          {activeTab==="library"&&(
              <div style={{animation:"fadeUp 0.4s ease both"}}>
                {favorites.length===0?(
                  <div style={{...cardStyle,padding:"60px 28px",textAlign:"center"}}>
                    <div style={{fontSize:52,marginBottom:16}}>📭</div>
                    <p style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:t.textPrimary,marginBottom:10}}>No saved recipes yet</p>
                    <p style={{fontSize:15,color:t.textMuted,marginBottom:24,lineHeight:1.6}}>Generate a recipe and tap <strong style={{color:t.accent}}>⭐ Save Recipe</strong> to add it here.</p>
                    <button onClick={()=>setActiveTab("create")} style={{background:t.accent,border:"none",borderRadius:12,padding:"14px 28px",color:"#fff",fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:700,cursor:"pointer",boxShadow:`0 6px 20px ${t.accent}44`}}>✦ Create My First Recipe</button>
                  </div>
                ):(
                  <div style={{display:"flex",flexDirection:"column",gap:18}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <span style={{fontSize:22}}>📚</span>
                        <p style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:t.textPrimary}}>My Recipe Library</p>
                      </div>
                      <span style={{fontSize:13,color:t.textMuted,fontWeight:600}}>{favorites.length} recipe{favorites.length!==1?"s":""} saved</span>
                    </div>
                    {favorites.length>=3&&(
                      <input
                        value={libSearch} onChange={e=>setLibSearch(e.target.value)}
                        placeholder="🔍  Search recipes by name or meat..."
                        style={{...inputStyle,fontSize:14,padding:"12px 18px"}}
                      />
                    )}
                    {favorites.filter(f=>!libSearch||f.recipe_name?.toLowerCase().includes(libSearch.toLowerCase())||f.meat?.toLowerCase().includes(libSearch.toLowerCase())).map(fav=>{
                      const isOpen=expandedFav===fav.id;
                      const sc=fav.health_score>=80?"#2d7a3a":fav.health_score>=60?"#c8840c":"#c8440c";
                      return (
                        <div key={fav.id} style={{...cardStyle,overflow:"hidden"}}>
                          <div onClick={()=>setExpandedFav(isOpen?null:fav.id)} style={{padding:"18px 20px",cursor:"pointer",display:"flex",alignItems:"center",gap:14,transition:"background 0.2s"}}
                            onMouseEnter={e=>e.currentTarget.style.background=t.mutedBg}
                            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                            <div style={{position:"relative",width:50,height:50,flexShrink:0}}>
                              <svg width="50" height="50" style={{position:"absolute",top:0,left:0,transform:"rotate(-90deg)"}}>
                                <circle cx="25" cy="25" r="19" fill="none" stroke={t.cardBorder} strokeWidth="5"/>
                                <circle cx="25" cy="25" r="19" fill="none" stroke={sc} strokeWidth="5" strokeLinecap="round"
                                  strokeDasharray={`${2*Math.PI*19}`} strokeDashoffset={`${2*Math.PI*19*(1-fav.health_score/100)}`}
                                  style={{filter:`drop-shadow(0 0 4px ${sc}66)`}}/>
                              </svg>
                              <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                                <span style={{fontFamily:"'Playfair Display',serif",fontSize:13,fontWeight:700,color:sc}}>{fav.health_score}</span>
                              </div>
                            </div>
                            <div style={{flex:1,minWidth:0}}>
                              <p style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700,color:t.textPrimary,marginBottom:5,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{fav.recipe_name}</p>
                              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                                <span style={{background:`${fav.meatColor}18`,border:`1px solid ${fav.meatColor}44`,borderRadius:99,padding:"3px 10px",fontSize:12,color:fav.meatColor,fontWeight:700}}>🍖 {fav.meat}</span>
                                <span style={{background:t.mutedBg,border:`1px solid ${t.cardBorder}`,borderRadius:99,padding:"3px 10px",fontSize:12,color:t.textMuted,fontWeight:600}}>🔥 {fav.method}</span>
                                <span style={{fontSize:12,color:t.textMuted,fontWeight:500,alignSelf:"center"}}>{fav.savedAt}</span>
                              </div>
                            </div>
                            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8,flexShrink:0}}>
                              <span style={{fontSize:20,transition:"transform 0.3s",transform:isOpen?"rotate(180deg)":"rotate(0)",display:"inline-block",color:t.textMuted,lineHeight:1}}>⌄</span>
                              <button onClick={e=>{e.stopPropagation();deleteFavorite(fav.id);}} title="Remove" style={{background:"none",border:`1.5px solid rgba(200,68,12,0.3)`,borderRadius:8,padding:"4px 8px",cursor:"pointer",fontSize:14,color:"#c8440c",fontWeight:700,transition:"all 0.2s"}}
                                onMouseEnter={e=>{e.target.style.background="#c8440c";e.target.style.color="#fff";}}
                                onMouseLeave={e=>{e.target.style.background="none";e.target.style.color="#c8440c";}}>🗑</button>
                            </div>
                          </div>
                          {isOpen&&(
                            <div style={{borderTop:`1px solid ${t.cardBorder}`,padding:"20px 22px",display:"flex",flexDirection:"column",gap:16,animation:"fadeUp 0.3s ease both"}}>
                              {fav.health_notes&&<div style={{background:t.mutedBg,border:`1.5px solid ${t.cardBorder}`,borderRadius:12,padding:"14px 17px"}}><p style={{fontSize:15,color:t.textPrimary,lineHeight:1.8,fontWeight:500}}>{fav.health_notes}</p></div>}
                              <div>
                                <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:14}}>
                                  <span style={{fontSize:18}}>🌿</span>
                                  <p style={{fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:700,color:t.textPrimary}}>Spice Mix</p>
                                </div>
                                <div style={{display:"flex",flexDirection:"column",gap:7}}>
                                  {fav.spice_mix?.map((s,i)=>{
                                    const C=["#c8440c","#c8840c","#8b4a10","#2d7a3a","#1a6e8a","#9b2a5a"],c=C[i%C.length];
                                    return (
                                      <div key={i} style={{display:"flex",alignItems:"center",gap:12,background:t.subBg,border:`1.5px solid ${t.cardBorder}`,borderRadius:12,padding:"12px 15px"}}>
                                        <span style={{minWidth:68,textAlign:"center",background:`${c}18`,border:`2px solid ${c}55`,borderRadius:10,padding:"6px 8px",fontSize:15,fontWeight:700,color:c,flexShrink:0,fontFamily:"'Playfair Display',serif"}}>{s.amount}</span>
                                        <div><p style={{fontWeight:700,color:t.textPrimary,fontSize:15,marginBottom:2}}>{s.spice}</p><p style={{color:t.textSecondary,fontSize:13,fontWeight:600}}>{s.role}</p></div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Cooking Instructions */}
                              {fav.cooking_instructions?.length>0&&(
                                <div>
                                  <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:14}}>
                                    <span style={{fontSize:18}}>👨‍🍳</span>
                                    <p style={{fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:700,color:t.textPrimary}}>Cooking Instructions</p>
                                  </div>
                                  <div style={{display:"flex",flexDirection:"column",gap:9}}>
                                    {fav.cooking_instructions.map((step,i)=>{
                                      const SC=["#c8440c","#c8840c","#c8640a","#2d7a3a","#1a6e8a","#9b2a5a"],sc=SC[i%SC.length];
                                      return (
                                        <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",background:t.subBg,border:`1.5px solid ${t.cardBorder}`,borderRadius:12,padding:"13px 15px"}}>
                                          <div style={{minWidth:32,height:32,borderRadius:9,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:800,fontFamily:"'Playfair Display',serif",background:`linear-gradient(135deg,${sc},${sc}cc)`,color:"#fff",boxShadow:`0 3px 10px ${sc}44`}}>{i+1}</div>
                                          <p style={{color:t.textPrimary,fontSize:15,lineHeight:1.75,fontWeight:500,fontFamily:"'Plus Jakarta Sans',sans-serif",paddingTop:3}}>{step}</p>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}

                              {fav.pro_tip&&(
                                <div style={{background:dark?"#181e2c":"#fff8f0",border:`2px solid ${dark?"#2e3a50":"#e8c88a"}`,borderLeft:`4px solid ${t.accent}`,borderRadius:12,padding:"15px 18px"}}>
                                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                                    <span style={{fontSize:18}}>💡</span>
                                    <p style={{fontSize:14,fontFamily:"'Playfair Display',serif",fontWeight:700,color:t.accent}}>Chef's Tip</p>
                                  </div>
                                  <p style={{fontSize:15,color:t.textPrimary,lineHeight:1.75,fontStyle:"italic",fontWeight:500}}>"{fav.pro_tip}"</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

          {/* ── CREATE VIEW ── */}
          {activeTab==="create"&&<>

          {/* ── FULL-SCREEN LOADING ── */}
          {loading&&(
            <div style={{minHeight:"60vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:24,animation:"fadeUp 0.3s ease both"}}>
              <div style={{position:"relative",width:80,height:80}}>
                <div style={{position:"absolute",inset:0,borderRadius:"50%",border:`4px solid ${t.cardBorder}`}}/>
                <div style={{position:"absolute",inset:0,borderRadius:"50%",border:`4px solid transparent`,borderTopColor:t.accent,animation:"spin 0.8s linear infinite"}}/>
                <div style={{position:"absolute",inset:8,borderRadius:"50%",border:`3px solid transparent`,borderTopColor:t.accentLight,animation:"spin 1.2s linear infinite reverse"}}/>
                <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>
                  {surpriseMode?"🎲":"🌿"}
                </div>
              </div>
              <div style={{textAlign:"center"}}>
                <p style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:t.textPrimary,marginBottom:8}}>{loadingMsg}</p>
                <p style={{fontSize:14,color:t.textMuted,fontWeight:500}}>Crafting your perfect recipe...</p>
              </div>
              <div style={{display:"flex",gap:8}}>
                {[0,1,2].map(i=>(
                  <div key={i} style={{width:8,height:8,borderRadius:"50%",background:t.accent,animation:`pulse 1.2s ease-in-out ${i*0.2}s infinite`,opacity:0.7}}/>
                ))}
              </div>
            </div>
          )}

          {/* ── FORM (slides out when loading starts, hidden when results show) ── */}
          {!loading&&screen==="form"&&<div style={{animation:"slideInLeft 0.4s ease both"}}>
            <div style={{textAlign:"center",marginBottom:44,animation:"fadeUp 0.8s ease both"}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:8,background:t.cardBg,border:`1.5px solid ${t.cardBorder}`,borderRadius:99,padding:"7px 20px",marginBottom:24,boxShadow:t.shadow,transition:"all 0.4s",flexWrap:"wrap",justifyContent:"center",animation:"badgePop 0.6s cubic-bezier(0.34,1.56,0.64,1) both"}}>
              <span style={{width:7,height:7,borderRadius:"50%",background:t.accent,display:"inline-block",flexShrink:0,boxShadow:`0 0 8px ${t.accent}`}}/>
              <span style={{fontSize:12,letterSpacing:2.5,color:t.accent,textTransform:"uppercase",fontWeight:800}}>AI-Powered · Health First</span>
            </div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:16,marginBottom:4}}>
              <span style={{fontSize:"clamp(36px,8vw,72px)",animation:"float 4s ease-in-out infinite",display:"inline-block"}}>🌶</span>
              <h1 className="title-gradient" style={{fontFamily:"'Playfair Display',serif",fontWeight:900,fontSize:"clamp(48px,11vw,100px)",lineHeight:0.92,letterSpacing:"clamp(-2px,-0.04em,-4px)",wordBreak:"break-word"}}>
                SpiceSight
              </h1>
              <span style={{fontSize:"clamp(36px,8vw,72px)",animation:"float 4s ease-in-out 2s infinite",display:"inline-block"}}>✨</span>
            </div>
            <p style={{color:t.textMuted,fontSize:"clamp(14px,3.5vw,17px)",fontWeight:500,marginTop:14,letterSpacing:0.3,lineHeight:1.6,transition:"color 0.4s",padding:"0 8px"}}>
              {surpriseMode?"Just add your spices — we'll decide everything else.":"Tell us your spices & meat —\nwe craft the perfect healthy recipe."}
            </p>
            <div style={{display:"flex",alignItems:"center",gap:16,justifyContent:"center",marginTop:24}}>
              <div style={{height:1.5,width:60,background:`linear-gradient(90deg,transparent,${t.accent}88)`}}/>
              <span style={{fontSize:20}}>🌿</span>
              <div style={{height:1.5,width:60,background:`linear-gradient(90deg,${t.accent}88,transparent)`}}/>
            </div>
            </div>

          {/* ── MODE TOGGLE ── */}
          <div style={{display:"flex",justifyContent:"center",marginBottom:28}}>
            <div style={{display:"inline-flex",background:t.cardBg,border:`2px solid ${t.cardBorder}`,borderRadius:99,padding:5,gap:4,boxShadow:t.shadowDeep}}>
              {[
                {id:false,icon:"🍖",label:"I'll Choose"},
                {id:true, icon:"🎲",label:"Surprise Me"},
              ].map(opt=>{
                const active=surpriseMode===opt.id;
                return (
                  <button key={String(opt.id)} onClick={()=>{if(opt.id){setDiceRolling(true);setTimeout(()=>setDiceRolling(false),800);}setSurpriseMode(opt.id);setResult(null);}} style={{
                    display:"flex",alignItems:"center",gap:8,padding:"13px 24px",
                    borderRadius:99,border:"none",cursor:"pointer",
                    fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700,
                    background:active?`linear-gradient(135deg,${t.accent},${t.accentLight})`:"transparent",
                    color:active?"#fff":t.textMuted,
                    transition:"all 0.3s ease",
                    boxShadow:active?`0 6px 24px ${t.accent}55`:"none",
                    transform:active?"scale(1.04)":"scale(1)",
                  }}>
                    <span style={{fontSize:18,display:"inline-block",animation:opt.id&&diceRolling?"diceRoll 0.8s cubic-bezier(0.34,1.56,0.64,1)":"none"}}>{opt.icon}</span>{opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── MAIN CARD ── */}
          <div style={{
            background:dark?"rgba(22,18,16,0.92)":"rgba(255,255,255,0.88)",
            backdropFilter:"blur(28px)",WebkitBackdropFilter:"blur(28px)",
            border:`1.5px solid ${dark?"rgba(255,128,32,0.12)":"rgba(236,220,200,0.9)"}`,
            borderRadius:32,
            padding:"clamp(20px,4vw,48px)",
            boxShadow:dark?"0 32px 80px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,128,32,0.08)":"0 32px 80px rgba(140,80,0,0.12), inset 0 1px 0 rgba(255,255,255,0.9)",
            display:"flex",flexDirection:"column",gap:52,
            animation:"fadeUp 0.7s 0.1s ease both",
          }}>

            {/* ── PROGRESS BAR ── */}
            {(()=>{
              const steps = surpriseMode
                ? [{label:"Spices",done:spices.length>0,icon:"🌶"},{label:"Veggies",done:true,icon:"🥦"},{label:"Flavor",done:true,icon:"🌍"},{label:"Generate",done:false,icon:"✦"}]
                : [{label:"Meat",done:hasMeat,icon:"🍖"},{label:"Method",done:selectedMethod!==null,icon:"🔥"},{label:"Spices",done:spices.length>0,icon:"🌶"},{label:"Veggies",done:true,icon:"🥦"},{label:"Generate",done:false,icon:"✦"}];
              const firstUndonei = steps.findIndex(s=>!s.done);
              const activeI = firstUndonei===-1?steps.length-1:firstUndonei;
              const pct = Math.round((steps.filter(s=>s.done).length/steps.length)*100);
              return (
                <div style={{marginBottom:4}}>
                  {/* Step dots row */}
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10,gap:4}}>
                    {steps.map((s,i)=>{
                      const isDone=s.done, isActive=i===activeI;
                      return (
                        <div key={s.label} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,flex:1}}>
                          <div style={{
                            width:isActive?36:28,height:isActive?36:28,borderRadius:"50%",
                            display:"flex",alignItems:"center",justifyContent:"center",
                            fontSize:isActive?16:13,
                            background:isDone?`linear-gradient(135deg,${t.accent},${t.accentLight})`:isActive?`${t.accent}22`:`${t.cardBorder}88`,
                            border:`2px solid ${isDone||isActive?t.accent:t.cardBorder}`,
                            color:isDone?"#fff":isActive?t.accent:t.textFaint,
                            transition:"all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
                            boxShadow:isActive?`0 0 0 4px ${t.accent}22`:isDone?`0 4px 12px ${t.accent}44`:"none",
                          }}>
                            {isDone?"✓":s.icon}
                          </div>
                          <span style={{
                            fontSize:10,fontWeight:isActive?700:600,
                            color:isDone?t.accent:isActive?t.textPrimary:t.textFaint,
                            fontFamily:"'Plus Jakarta Sans',sans-serif",
                            letterSpacing:0.3,textAlign:"center",
                            transition:"color 0.3s",
                          }}>{s.label}</span>
                        </div>
                      );
                    })}
                  </div>
                  {/* Fill bar */}
                  <div style={{height:5,background:t.cardBorder,borderRadius:99,overflow:"hidden",border:`1px solid ${t.inputBorder}`}}>
                    <div style={{
                      height:"100%",borderRadius:99,
                      width:`${pct}%`,
                      background:`linear-gradient(90deg,${t.accent},${t.accentLight})`,
                      boxShadow:`0 0 8px ${t.accent}66`,
                      transition:"width 0.5s cubic-bezier(0.34,1.56,0.64,1)",
                    }}/>
                  </div>
                </div>
              );
            })()}

            {/* STEP 1 & 2 — only in "I'll Choose" mode */}
            {!surpriseMode&&<>
            {/* STEP 1 — MEAT */}
            <div>
              <StepHeader number="01" title="Choose Your Meat" icon="🍖" t={t}/>
              <p style={{fontSize:13,color:t.textMuted,fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:500,marginBottom:14,marginTop:-16}}>
                Tap to select — pick one or combine multiple
              </p>
              <div style={{display:"flex",flexWrap:"wrap",gap:10,marginBottom:14}}>
                {MEATS.map(m=>{
                  const active=selectedMeats.includes(m.id);
                  return (
                    <div key={m.id} onClick={()=>{
                      setFlippingMeat(m.id);
                      setSelectedMeats(p=>p.includes(m.id)?p.filter(x=>x!==m.id):[...p,m.id]);
                      setTimeout(()=>setFlippingMeat(null),500);
                    }} style={{
                      position:"relative",overflow:"hidden",
                      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
                      gap:7,padding:"18px 10px",
                      background:active?`${m.color}12`:t.inputBg,
                      border:`2px solid ${active?m.color:t.cardBorder}`,
                      borderRadius:18,cursor:"pointer",
                      transition:"background 0.3s,border-color 0.3s,box-shadow 0.3s",
                      minWidth:80,flex:"1 1 76px",minHeight:88,
                      boxShadow:active?`0 8px 28px ${m.color}33`:t.shadow,
                      animation:flippingMeat===m.id?"cardFlip 0.45s cubic-bezier(0.34,1.56,0.64,1) both":"none",
                      transform:(!flippingMeat&&active)?"translateY(-5px) scale(1.06)":"translateY(0) scale(1)",
                      perspective:"600px",
                    }}
                    onMouseEnter={e=>{if(!active&&flippingMeat!==m.id){e.currentTarget.style.transform="translateY(-5px) scale(1.04)";e.currentTarget.style.boxShadow=`0 10px 24px ${m.color}22`;}}}
                    onMouseLeave={e=>{if(!active&&flippingMeat!==m.id){e.currentTarget.style.transform="translateY(0) scale(1)";e.currentTarget.style.boxShadow=t.shadow;}}}
                    >
                      <span style={{fontSize:26,display:"block",transition:"transform 0.35s cubic-bezier(0.34,1.56,0.64,1)",transform:active?"scale(1.25)":"scale(1)"}}>{m.emoji}</span>
                      <span style={{fontSize:12,fontWeight:700,color:active?m.color:t.textMuted,transition:"color 0.3s",textTransform:"uppercase",letterSpacing:0.5}}>{m.label}</span>
                      {active&&<div style={{position:"absolute",top:7,right:7,width:18,height:18,borderRadius:"50%",background:m.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#fff",fontWeight:800,boxShadow:`0 2px 8px ${m.color}66`}}>✓</div>}
                      {active&&<div style={{position:"absolute",bottom:0,left:"50%",transform:"translateX(-50%)",width:24,height:3,borderRadius:99,background:m.color,boxShadow:`0 0 8px ${m.color}`}}/>}
                    </div>
                  );
                })}
              </div>
              <input
                value={customMeat} onChange={e=>setCustomMeat(e.target.value)}
                onFocus={()=>{}}
                placeholder="✏  Or type any other meat..."
                style={inputStyle}
              />
              {/* Selection summary + continue nudge */}
              {hasMeat&&(
                <div style={{marginTop:14,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    {allMeatLabels.map((l,i)=>{
                      const mc=MEATS.find(m=>m.label===l)?.color||t.accent;
                      return <span key={i} style={{background:`${mc}18`,border:`1.5px solid ${mc}55`,borderRadius:99,padding:"5px 14px",fontSize:13,color:mc,fontWeight:700}}>✓ {l}</span>;
                    })}
                  </div>
                  <button onClick={()=>scrollToStep(refMethod,0)} style={{
                    display:"flex",alignItems:"center",gap:6,
                    background:`linear-gradient(135deg,${t.accent},${t.accentLight})`,
                    border:"none",borderRadius:99,padding:"9px 18px",cursor:"pointer",
                    fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,fontWeight:700,
                    color:"#fff",boxShadow:`0 4px 16px ${t.accent}44`,
                    whiteSpace:"nowrap",
                  }}>Continue to Method →</button>
                </div>
              )}
            </div>

            {/* Divider */}
            <div style={{height:"1.5px",background:`linear-gradient(90deg,transparent,${t.cardBorder},transparent)`,margin:"8px 0"}}/>

            {/* STEP 2 — METHOD */}
            <div ref={refMethod}>
              <StepHeader number="02" title="Cooking Method" icon="🔥" t={t}/>
              <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
                {METHODS.map(m=>{
                  const active=selectedMethod===m.id;
                  return (
                    <button key={m.id} onClick={()=>{setSelectedMethod(m.id);scrollToStep(refSpices);}} style={{
                      display:"inline-flex",alignItems:"center",gap:8,
                      padding:"12px 22px",borderRadius:99,cursor:"pointer",
                      fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:15,fontWeight:600,
                      border:`2px solid ${active?t.accent:t.cardBorder}`,
                      background:active?t.accent:t.inputBg,
                      color:active?"#fff":t.textSecondary,
                      transition:"all 0.25s ease",
                      boxShadow:active?`0 6px 22px ${t.accent}44`:t.shadow,
                      transform:active?"translateY(-2px)":"translateY(0)",
                    }}
                    onMouseEnter={e=>{if(!active){e.currentTarget.style.borderColor=t.accent;e.currentTarget.style.color=t.accent;e.currentTarget.style.background=t.accentBg;}}}
                    onMouseLeave={e=>{if(!active){e.currentTarget.style.borderColor=t.cardBorder;e.currentTarget.style.color=t.textSecondary;e.currentTarget.style.background=t.inputBg;}}}
                    >
                      <span style={{fontSize:17}}>{m.icon}</span>{m.id}
                    </button>
                  );
                })}
                <button onClick={()=>{setSelectedMethod("custom");scrollToStep(refSpices);}} style={{
                  display:"inline-flex",alignItems:"center",gap:8,
                  padding:"12px 22px",borderRadius:99,cursor:"pointer",
                  fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:15,fontWeight:600,
                  border:`2px solid ${selectedMethod==="custom"?t.accent:t.cardBorder}`,
                  background:selectedMethod==="custom"?t.accent:t.inputBg,
                  color:selectedMethod==="custom"?"#fff":t.textSecondary,
                  transition:"all 0.25s",boxShadow:selectedMethod==="custom"?`0 6px 22px ${t.accent}44`:t.shadow,
                }}>✏ Other</button>
              </div>
              {selectedMethod==="custom"&&(
                <input value={customMethod} onChange={e=>setCustomMethod(e.target.value)} placeholder="e.g. Sous vide, Steaming, Deep fry..." style={{...inputStyle,marginTop:14}} autoFocus/>
              )}
            </div>

            <div style={{height:"1.5px",background:`linear-gradient(90deg,transparent,${t.cardBorder},transparent)`,margin:"8px 0"}}/>
            </>}

            {/* SURPRISE MODE — optional protein hint */}
            {surpriseMode&&(
              <div style={{animation:"fadeUp 0.4s ease both"}}>
                <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:20}}>
                  <div style={{width:40,height:40,borderRadius:12,flexShrink:0,background:`linear-gradient(135deg,${t.accent},${t.accentLight})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,boxShadow:`0 4px 16px ${t.accent}55`}}>🎲</div>
                  <div>
                    <p style={{fontSize:10,letterSpacing:3,color:t.accent,textTransform:"uppercase",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,marginBottom:2}}>Step 01</p>
                    <p style={{fontSize:20,fontFamily:"'Playfair Display',serif",fontWeight:700,color:t.textPrimary}}>What Protein Do You Have? (Optional)</p>
                  </div>
                </div>
                <div style={{background:dark?"rgba(255,122,46,0.06)":"rgba(200,68,12,0.04)",border:`2px dashed ${t.accent}55`,borderRadius:16,padding:"20px 22px",marginBottom:14}}>
                  <p style={{fontSize:14,color:t.textMuted,fontWeight:500,marginBottom:14,lineHeight:1.6}}>
                    💡 Tell us what you have (e.g. <strong style={{color:t.accent}}>chicken</strong>) — or leave it blank and let the AI decide the best protein for your spices.
                  </p>
                  <input
                    value={surpriseProtein}
                    onChange={e=>setSurpriseProtein(e.target.value)}
                    placeholder="e.g. Chicken, Beef, Fish... or leave blank 🎲"
                    style={{...inputStyle,border:`2px solid ${t.accent}55`,background:t.inputBg}}
                  />
                </div>
                <div style={{height:"1.5px",background:`linear-gradient(90deg,transparent,${t.cardBorder},transparent)`,margin:"8px 0"}}/>
              </div>
            )}

            {/* STEP 3 — SPICES */}
            <div ref={refSpices}>
              <StepHeader number={surpriseMode?"02":"03"} title="Your Available Spices" icon="🌶" t={t}/>
              <div style={{background:t.inputBg,border:`2px solid ${t.spiceBorder}`,borderRadius:16,padding:"14px 16px",display:"flex",flexWrap:"wrap",gap:8,minHeight:58,marginBottom:16,transition:"all 0.4s"}}>
                {spices.map(s=>(
                  <WarmTag key={s} label={s} color={t.spiceColor} bg={t.spiceBg} t={t} bounce={bouncingTag===s} onRemove={()=>setSpices(p=>p.filter(x=>x!==s))}/>
                ))}
                <input value={spiceInput} onChange={e=>setSpiceInput(e.target.value)} onKeyDown={onSpiceKey}
                  onBlur={()=>{if(spiceInput.trim()){addSpice(spiceInput);setSpiceInput("");}}}
                  placeholder={spices.length===0?"Type a spice & press Enter to add...":"Add more spices..."}
                  style={{flex:"1 1 160px",background:"none",border:"none",outline:"none",color:dark?t.textPrimary:t.spiceColor,fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:15,minWidth:140,fontWeight:500}}/>
              </div>
              <p style={{fontSize:13,letterSpacing:1.5,color:dark?"#f0c040":"#c8840c",textTransform:"uppercase",fontWeight:700,marginBottom:10,marginTop:20}}>⚡ Quick Add Spices</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {QUICK_SPICES.filter(s=>!spices.includes(s)).map(s=>(
                  <button key={s} onClick={()=>addSpice(s)} style={{
                    padding:"9px 18px",borderRadius:99,cursor:"pointer",
                    fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:14,fontWeight:600,
                    border:`2px solid ${t.spiceBorder}`,background:t.spiceBg,color:t.spiceColor,
                    transition:"all 0.2s",boxShadow:"none",
                  }}
                  onMouseEnter={e=>{e.target.style.background=t.spiceColor;e.target.style.color="#fff";e.target.style.borderColor=t.spiceColor;e.target.style.transform="scale(1.05) translateY(-2px)";e.target.style.boxShadow=`0 6px 16px ${t.spiceColor}44`}}
                  onMouseLeave={e=>{e.target.style.background=t.spiceBg;e.target.style.color=t.spiceColor;e.target.style.borderColor=t.spiceBorder;e.target.style.transform="scale(1)";e.target.style.boxShadow="none"}}
                  >+ {s}</button>
                ))}
              </div>
            </div>

            <div style={{height:"1.5px",background:`linear-gradient(90deg,transparent,${t.cardBorder},transparent)`,margin:"8px 0"}}/>

            {/* STEP 4 — VEGGIES */}
            <div ref={refVeggies}>
              <StepHeader number={surpriseMode?"03":"04"} title="Add Vegetables (Optional)" icon="🥦" t={t}/>
              <div className="veggie-toggle" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:18}}>
                {[
                  {id:"with",emoji:"🥩",title:"Cook With Meat",  desc:"Absorbs all the flavors",color:"#c8640a"},
                  {id:"side",emoji:"🥗",title:"On the Side",      desc:"Cooked separately",       color:"#2d7a3a"},
                ].map(opt=>{
                  const active=veggieStyle===opt.id;
                  return (
                    <div key={opt.id} onClick={()=>setVeggieStyle(opt.id)} style={{
                      padding:"20px 16px",borderRadius:18,cursor:"pointer",textAlign:"center",
                      border:`2.5px solid ${active?opt.color:`${opt.color}33`}`,
                      background:active?`${opt.color}${dark?"1e":"0e"}`:t.inputBg,
                      transition:"all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                      boxShadow:active?`0 8px 28px ${opt.color}33`:t.shadow,
                      transform:active?"scale(1.03)":"scale(1)",
                    }}>
                      <span style={{fontSize:30,display:"block",marginBottom:8,transition:"transform 0.3s",transform:active?"scale(1.2)":"scale(1)"}}>{opt.emoji}</span>
                      <p style={{fontSize:16,fontWeight:700,color:active?opt.color:t.textSecondary,fontFamily:"'Playfair Display',serif",marginBottom:5}}>{opt.title}</p>
                      <p style={{fontSize:13,color:active?opt.color+"cc":t.textFaint,fontWeight:500}}>{opt.desc}</p>
                      {active&&(
                        <div style={{marginTop:10,display:"inline-block",background:`${opt.color}18`,border:`1.5px solid ${opt.color}55`,borderRadius:99,padding:"4px 14px"}}>
                          <span style={{fontSize:11,color:opt.color,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase"}}>✓ Selected</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div style={{background:t.vegInputBg,border:`2px solid ${t.vegBorder}`,borderRadius:16,padding:"14px 16px",display:"flex",flexWrap:"wrap",gap:8,minHeight:58,marginBottom:16,transition:"all 0.4s"}}>
                {veggies.map(v=>(
                  <WarmTag key={v} label={v} color={t.vegColor} bg={t.vegBg} t={t} onRemove={()=>setVeggies(p=>p.filter(x=>x!==v))}/>
                ))}
                <input value={veggieInput} onChange={e=>setVeggieInput(e.target.value)} onKeyDown={onVeggieKey}
                  onBlur={()=>{if(veggieInput.trim()){addVeggie(veggieInput);setVeggieInput("");}}}
                  placeholder={veggies.length===0?"Type a veggie & press Enter...":"Add more veggies..."}
                  style={{flex:"1 1 160px",background:"none",border:"none",outline:"none",color:dark?t.textPrimary:t.vegColor,fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:15,minWidth:140,fontWeight:500}}/>
              </div>
              <p style={{fontSize:13,letterSpacing:1.5,color:t.vegColor,textTransform:"uppercase",fontWeight:700,marginBottom:10,marginTop:20}}>⚡ Quick Add Vegetables</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {QUICK_VEGGIES.filter(v=>!veggies.includes(v)).map(v=>(
                  <button key={v} onClick={()=>addVeggie(v)} style={{
                    padding:"9px 18px",borderRadius:99,cursor:"pointer",
                    fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:14,fontWeight:600,
                    border:`2px solid ${t.vegBorder}`,background:t.vegBg,color:t.vegColor,
                    transition:"all 0.2s",
                  }}
                  onMouseEnter={e=>{e.target.style.background=t.vegColor;e.target.style.color="#fff";e.target.style.borderColor=t.vegColor;e.target.style.transform="scale(1.05) translateY(-2px)";e.target.style.boxShadow=`0 6px 16px ${t.vegColor}44`}}
                  onMouseLeave={e=>{e.target.style.background=t.vegBg;e.target.style.color=t.vegColor;e.target.style.borderColor=t.vegBorder;e.target.style.transform="scale(1)";e.target.style.boxShadow="none"}}
                  >+ {v}</button>
                ))}
              </div>
            </div>

            <div style={{height:"1.5px",background:`linear-gradient(90deg,transparent,${t.cardBorder},transparent)`,margin:"8px 0"}}/>

            {/* FLAVOR PROFILES */}
            <div ref={refFlavor}>
              <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:20}}>
                <div style={{width:40,height:40,borderRadius:12,flexShrink:0,background:`linear-gradient(135deg,#9b55e0,#c080f8)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,boxShadow:`0 4px 16px #9b55e055`}}>🌍</div>
                <div>
                  <p style={{fontSize:10,letterSpacing:3,color:"#9b55e0",textTransform:"uppercase",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,marginBottom:2}}>{surpriseMode?"Step 03 (Optional)":"Step 05 (Optional)"}</p>
                  <p style={{fontSize:20,fontFamily:"'Playfair Display',serif",fontWeight:700,color:t.textPrimary}}>Choose a Flavor Profile</p>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:10}}>
                {FLAVOR_PROFILES.map(fp=>{
                  const active=flavorProfile===fp.id;
                  return (
                    <div key={fp.id} onClick={()=>setFlavorProfile(active?null:fp.id)} style={{
                      padding:"16px 14px",borderRadius:16,cursor:"pointer",
                      border:`2px solid ${active?fp.color:`${fp.color}33`}`,
                      background:active?`${fp.color}${dark?"22":"0e"}`:t.inputBg,
                      transition:"all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
                      boxShadow:active?`0 6px 20px ${fp.color}33`:t.shadow,
                      transform:active?"translateY(-3px) scale(1.03)":"translateY(0) scale(1)",
                      position:"relative",overflow:"hidden",
                    }}
                    onMouseEnter={e=>{if(!active){e.currentTarget.style.borderColor=`${fp.color}88`;e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=`0 4px 14px ${fp.color}22`;}}}
                    onMouseLeave={e=>{if(!active){e.currentTarget.style.borderColor=`${fp.color}33`;e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow=t.shadow;}}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                        <span style={{fontSize:22}}>{fp.emoji}</span>
                        <p style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:700,color:active?fp.color:t.textPrimary}}>{fp.label}</p>
                        {active&&<span style={{marginLeft:"auto",fontSize:13,color:fp.color,fontWeight:700}}>✓</span>}
                      </div>
                      <p style={{fontSize:14,color:active?fp.color:t.textSecondary,fontWeight:600,lineHeight:1.6}}>{fp.desc}</p>
                    </div>
                  );
                })}
              </div>
              {flavorProfile&&(
                <div style={{marginTop:12,display:"flex",alignItems:"center",gap:8,background:dark?"rgba(155,85,224,0.1)":"rgba(155,85,224,0.06)",border:`1.5px solid #9b55e055`,borderRadius:12,padding:"11px 16px"}}>
                  <span style={{fontSize:16}}>✨</span>
                  <p style={{fontSize:13,color:dark?"#d0a0f8":"#7030c0",fontWeight:600}}>
                    <strong>{FLAVOR_PROFILES.find(f=>f.id===flavorProfile)?.label}</strong> profile active — AI will bias the recipe toward these flavors
                  </p>
                  <button onClick={()=>setFlavorProfile(null)} style={{marginLeft:"auto",background:"none",border:"none",cursor:"pointer",fontSize:18,color:"#9b55e0",lineHeight:1,padding:0}}>×</button>
                </div>
              )}
            </div>

            {/* SERVINGS */}
            <div style={{...cardStyle,padding:"20px 24px"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:16}}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <span style={{fontSize:22}}>👥</span>
                  <div>
                    <p style={{fontSize:10,letterSpacing:3,color:t.accent,textTransform:"uppercase",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,marginBottom:2}}>Serving Size</p>
                    <p style={{fontSize:14,color:t.textSecondary,fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:600}}>Scales ingredient amounts for {servings} {servings===1?"person":"people"}</p>
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:0,background:t.inputBg,border:`2px solid ${t.cardBorder}`,borderRadius:14,overflow:"hidden"}}>
                  <button onClick={()=>setServings(s=>Math.max(1,s-1))} style={{
                    width:44,height:44,border:"none",cursor:"pointer",
                    background:"transparent",color:t.textMuted,fontSize:20,fontWeight:700,
                    fontFamily:"'Playfair Display',serif",transition:"all 0.15s",
                    display:"flex",alignItems:"center",justifyContent:"center",
                  }}
                  onMouseEnter={e=>{e.currentTarget.style.background=t.accentBg;e.currentTarget.style.color=t.accent;}}
                  onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color=t.textMuted;}}>
                    −
                  </button>
                  <div style={{
                    width:80,height:44,display:"flex",flexDirection:"column",
                    alignItems:"center",justifyContent:"center",
                    borderLeft:`1.5px solid ${t.cardBorder}`,borderRight:`1.5px solid ${t.cardBorder}`,
                  }}>
                    <span style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:900,color:t.textPrimary,lineHeight:1}}>{servings}</span>
                    <span style={{fontSize:10,color:t.textFaint,fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:600,letterSpacing:0.5}}>{servings===1?"person":"people"}</span>
                  </div>
                  <button onClick={()=>setServings(s=>Math.min(10,s+1))} style={{
                    width:44,height:44,border:"none",cursor:"pointer",
                    background:"transparent",color:t.textMuted,fontSize:20,fontWeight:700,
                    fontFamily:"'Playfair Display',serif",transition:"all 0.15s",
                    display:"flex",alignItems:"center",justifyContent:"center",
                  }}
                  onMouseEnter={e=>{e.currentTarget.style.background=t.accentBg;e.currentTarget.style.color=t.accent;}}
                  onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color=t.textMuted;}}>
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* GENERATE */}
            <div ref={refGenerate} style={{position:"relative"}}>
              <ParticleBurst particles={particles}/>
              <button onClick={generate} disabled={!canGenerate} style={{
                position:"relative",overflow:"hidden",width:"100%",padding:"22px",
                borderRadius:18,cursor:canGenerate?"pointer":"not-allowed",border:"none",
                fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,
                letterSpacing:"1px",color:"#fff",
                background:`linear-gradient(135deg,${t.accent},${t.accentLight},${t.accent})`,
                backgroundSize:"200% 100%",
                opacity:canGenerate?1:0.35,
                transition:"transform 0.3s,box-shadow 0.3s,opacity 0.3s",
                animation:canGenerate?"warmPulse 2.5s ease-in-out infinite,shimmer 3s linear infinite":"none",
              }}
              onMouseEnter={e=>{if(canGenerate){e.currentTarget.style.transform="translateY(-4px) scale(1.01)";e.currentTarget.style.boxShadow=`0 20px 50px ${t.accent}55`;}}}
              onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none";}}>
                {loading
                  ? <span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:12}}>
                      <span style={{width:22,height:22,border:"3px solid rgba(255,255,255,0.3)",borderTopColor:"#fff",borderRadius:"50%",display:"inline-block",animation:"spin 0.7s linear infinite"}}/>
                      {loadingMsg}
                    </span>
                  : surpriseMode?"🎲  Surprise Me With a Recipe  🎲":"✦  Generate My Seasoning  ✦"
                }
              </button>
              {!canGenerate&&!loading&&(
                <p style={{textAlign:"center",fontSize:14,color:t.textFaint,marginTop:12,fontWeight:500}}>
                  {surpriseMode?"👆 Add at least one spice to get started":!hasMeat?"👆 Pick a meat to get started":spices.length===0?"👆 Add at least one spice":""}
                </p>
              )}
              {error&&<p style={{color:t.accent,textAlign:"center",fontSize:14,marginTop:12,fontWeight:600}}>⚠ {error}</p>}
            </div>
          </div>
          </div>}

          {/* ── RESULTS (slides in from right) ── */}
          {!loading&&screen==="results"&&result&&(
            <div style={{animation:"slideInRight 0.45s cubic-bezier(0.22,1,0.36,1) both"}}>
            <div style={{display:"flex",flexDirection:"column",gap:22}}>

              {/* Title */}
              <div className="rc" style={{
                background:dark?"linear-gradient(135deg,#1e2535,#171e2e)":"linear-gradient(135deg,#fff8f2,#fef3e8)",
                border:`2px solid ${dark?"#2e3a5a":t.cardBorder}`,borderRadius:24,
                padding:"clamp(20px,4vw,36px)",boxShadow:t.shadowDeep,transition:"all 0.4s",
              }}>
                <p style={{fontSize:11,letterSpacing:3,color:t.accent,textTransform:"uppercase",marginBottom:10,fontWeight:700}}>Your Custom Recipe</p>
                <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(22px,5vw,40px)",fontWeight:900,color:t.textPrimary,lineHeight:1.15,marginBottom:18,wordBreak:"break-word"}}>{result.recipe_name}</h2>
                <div className="recipe-tags" style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  {[
                    {label:`🌶 ${result.flavor_profile}`,bg:dark?"#1e1a08":"#fff0e0",bc:"#e8a050",col:dark?"#f0c040":"#8b4a10"},
                    {label:`🍖 ${meatLabel}`,             bg:`${meatColor}18`,         bc:`${meatColor}55`,col:meatColor},
                    {label:`🔥 ${methodLabel}`,           bg:dark?"#1e1808":"#fff4ee",bc:"#e87050",col:dark?"#ff7a2e":"#8b3820"},
                    {label:`👥 Serves ${servings}`,       bg:dark?"#0d1520":"#eef3ff", bc:"#7090d0",col:dark?"#90b8f8":"#2040a0"},
                    ...(flavorProfile?[{label:`${FLAVOR_PROFILES.find(f=>f.id===flavorProfile)?.emoji} ${FLAVOR_PROFILES.find(f=>f.id===flavorProfile)?.label}`,bg:dark?"#1e1030":"#f8eeff",bc:"#c090e8",col:dark?"#c090f8":"#7030c0"}]:[]),
                    ...(veggies.length>0?[{label:veggieStyle==="with"?"🥩+🥦 With Meat":"🥗 On the Side",bg:dark?"#0a1e10":"#eef7f0",bc:"#7abd8a",col:dark?"#52d468":"#2d6e3a"}]:[])
                  ].map(b=>(
                    <span key={b.label} style={{background:b.bg,border:`1.5px solid ${b.bc}`,borderRadius:99,padding:"6px 16px",fontSize:14,color:b.col,fontWeight:700}}>{b.label}</span>
                  ))}
                </div>
              </div>

              {/* AI Reasoning — only in surprise mode */}
              {surpriseMode&&result.ai_reasoning&&(
                <div className="rc" style={{
                  background:dark?"linear-gradient(135deg,#1a1020,#140d1e)":"linear-gradient(135deg,#fdf4ff,#f8eeff)",
                  border:`2px solid ${dark?"#3a2a50":"#d4b0f0"}`,
                  borderLeft:`5px solid #9b55e0`,
                  borderRadius:22,padding:"clamp(18px,4vw,28px)",boxShadow:t.shadow,transition:"all 0.4s",
                }}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
                    <span style={{fontSize:22}}>🤖</span>
                    <p style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:700,color:dark?"#c890f8":"#6b20c8"}}>Why the AI Chose This</p>
                  </div>
                  <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:14}}>
                    <span style={{background:dark?"rgba(155,85,224,0.15)":"rgba(155,85,224,0.1)",border:`1.5px solid ${dark?"#6a30b0":"#c090e8"}`,borderRadius:99,padding:"6px 16px",fontSize:14,color:dark?"#c890f8":"#6b20c8",fontWeight:700}}>🍖 {result.chosen_protein}</span>
                    <span style={{background:dark?"rgba(255,122,46,0.12)":"rgba(200,68,12,0.08)",border:`1.5px solid ${dark?"#7a3a20":"#e8a060"}`,borderRadius:99,padding:"6px 16px",fontSize:14,color:dark?"#ff9a60":"#8b3820",fontWeight:700}}>🔥 {result.chosen_method}</span>
                  </div>
                  <p style={{fontSize:15,color:t.textPrimary,lineHeight:1.8,fontWeight:500}}>{result.ai_reasoning}</p>
                </div>
              )}

              {/* Health */}
              <div className="rc" style={{...cardStyle,padding:"28px"}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:22}}>
                  <span style={{fontSize:22}}>💚</span>
                  <p style={{fontSize:18,fontFamily:"'Playfair Display',serif",fontWeight:700,color:t.textPrimary}}>Health Analysis</p>
                </div>
                <ChefMascot score={result.health_score}/>
                <div style={{marginTop:20,marginBottom:20}}>
                  <HealthRing score={result.health_score} t={t}/>
                </div>
                <div style={{background:t.mutedBg,border:`1.5px solid ${t.cardBorder}`,borderRadius:12,padding:"16px 18px",marginTop:18}}>
                  <p style={{fontSize:15,color:t.textPrimary,lineHeight:1.8,fontWeight:500}}>{result.health_notes}</p>
                </div>
              </div>

              {/* Spice mix */}
              <div className="rc" style={{...cardStyle,padding:"28px"}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:22}}>
                  <span style={{fontSize:22}}>🌿</span>
                  <p style={{fontSize:18,fontFamily:"'Playfair Display',serif",fontWeight:700,color:t.textPrimary}}>Your Spice Mix</p>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  {result.spice_mix?.map((s,i)=>{
                    const colors=["#c8440c","#c8840c","#8b4a10","#2d7a3a","#1a6e8a","#9b2a5a"];
                    const c=colors[i%colors.length];
                    return (
                      <div key={i} className="spice-row" style={{display:"flex",alignItems:"center",gap:14,background:t.subBg,border:`1.5px solid ${t.cardBorder}`,borderRadius:14,padding:"18px 20px",transition:"all 0.25s",cursor:"default"}}
                        onMouseEnter={e=>{e.currentTarget.style.background=`${c}14`;e.currentTarget.style.borderColor=`${c}55`;e.currentTarget.style.transform="translateX(6px)";}}
                        onMouseLeave={e=>{e.currentTarget.style.background=t.subBg;e.currentTarget.style.borderColor=t.cardBorder;e.currentTarget.style.transform="translateX(0)";}}>
                        <div className="spice-amount spice-amount-shimmer" style={{minWidth:78,textAlign:"center",background:`${c}18`,border:`2px solid ${c}55`,borderRadius:12,padding:"9px 10px",fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:c,flexShrink:0,boxShadow:`0 2px 12px ${c}33`,cursor:"default",transition:"all 0.2s"}}>{s.amount}</div>
                        <div style={{flex:1}}>
                          <p style={{fontWeight:700,color:t.textPrimary,fontSize:16,marginBottom:3}}>{s.spice}</p>
                          <p style={{color:t.textSecondary,fontSize:13,fontWeight:600}}>{s.role}</p>
                        </div>
                        <span style={{fontSize:20}}>🌿</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Marinate + Method */}
              <div className="rc marinate-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                {[
                  {label:"Marinate Time",val:result.marinate_time,icon:"⏱",color:"#9b2a5a"},
                  {label:"Cook Method",  val:methodLabel,          icon:"🔥",color:t.accent},
                ].map(x=>(
                  <div key={x.label} style={{...cardStyle,padding:"24px",textAlign:"center",border:`1.5px solid ${x.color}33`}}>
                    <span style={{fontSize:30,display:"block",marginBottom:10}}>{x.icon}</span>
                    <p style={{fontSize:14,color:t.textMuted,textTransform:"uppercase",marginBottom:8,fontWeight:700,letterSpacing:0.5,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{x.label}</p>
                    <p style={{fontFamily:"'Playfair Display',serif",fontWeight:700,color:x.color,fontSize:22}}>{x.val}</p>
                  </div>
                ))}
              </div>

              {/* Cooking instructions */}
              <div className="rc" style={{...cardStyle,padding:"28px"}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:22,flexWrap:"wrap",gap:8}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontSize:22}}>👨‍🍳</span>
                    <p style={{fontSize:18,fontFamily:"'Playfair Display',serif",fontWeight:700,color:t.textPrimary}}>Cooking Instructions</p>
                  </div>
                  <span className="step-hint" style={{fontSize:13,color:t.textPrimary,fontStyle:"italic",fontWeight:600,background:t.accentBg,border:`1px solid ${t.accent}44`,borderRadius:99,padding:"5px 14px",whiteSpace:"nowrap"}}>👆 Click any step to mark done ✓</span>
                </div>
                <CookingSteps steps={result.cooking_instructions} t={t}/>
              </div>

              {/* Veggie prep */}
              {result.veggie_prep&&(
                <div className="rc" style={{background:t.vegInputBg,border:`2px solid ${t.vegBorder}`,borderRadius:22,padding:"28px",boxShadow:t.shadow,transition:"all 0.4s"}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10,marginBottom:22}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <span style={{fontSize:24}}>🥦</span>
                      <p style={{fontSize:18,fontFamily:"'Playfair Display',serif",fontWeight:700,color:t.vegColor}}>Vegetable Preparation</p>
                    </div>
                    <span style={{background:t.cardBg,border:`2px solid ${t.vegBorder}`,borderRadius:99,padding:"6px 16px",fontSize:13,color:t.vegColor,fontWeight:700}}>
                      {result.veggie_prep.style==="With the Meat"?"🥩 With Meat":"🥗 On the Side"}
                    </span>
                  </div>
                  <span style={{display:"inline-block",fontSize:13,color:t.vegColor,fontStyle:"italic",fontWeight:600,background:t.vegBg,border:`1px solid ${t.vegBorder}`,borderRadius:99,padding:"5px 14px",marginBottom:16}}>👆 Click any step to mark done ✓</span>
                  <CookingSteps steps={result.veggie_prep.instructions} t={t}/>
                  {result.veggie_prep.tip&&(
                    <div style={{marginTop:16,background:t.vegBg,border:`1.5px solid ${t.vegBorder}`,borderLeft:`4px solid ${t.vegColor}`,borderRadius:12,padding:"16px 18px"}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                        <span style={{fontSize:20}}>🌿</span>
                        <p style={{fontSize:16,fontFamily:"'Playfair Display',serif",fontWeight:700,color:t.vegColor}}>Veggie Tip</p>
                      </div>
                      <p style={{fontSize:15,color:t.textPrimary,lineHeight:1.75,fontWeight:500,fontStyle:"italic"}}>"{result.veggie_prep.tip}"</p>
                    </div>
                  )}
                </div>
              )}

              {/* Pro tip */}
              {result.pro_tip&&(
                <div className="rc" style={{
                  background:dark?"#181e2c":"linear-gradient(135deg,#fff8f0,#fff4ea)",
                  border:`2px solid ${dark?"#2e3a50":"#e8a860"}`,borderLeft:`5px solid ${t.accent}`,
                  borderRadius:18,padding:"24px 28px",boxShadow:t.shadow,transition:"all 0.4s",
                }}>
                  <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:12}}>
                    <span style={{fontSize:22}}>👨‍🍳</span>
                    <p style={{fontSize:12,letterSpacing:2.5,color:t.accent,textTransform:"uppercase",fontWeight:700}}>Chef's Pro Tip</p>
                  </div>
                  <p style={{fontSize:16,color:t.textPrimary,lineHeight:1.8,fontWeight:500,fontStyle:"italic"}}>"{result.pro_tip}"</p>
                </div>
              )}

              {/* Action row */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginTop:4}}>
                <button onClick={goBack} style={{
                  background:t.cardBg,border:`2px solid ${t.cardBorder}`,borderRadius:14,
                  padding:"15px",color:t.textSecondary,cursor:"pointer",
                  fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700,
                  transition:"all 0.25s",boxShadow:t.shadow,
                }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=t.accent;e.currentTarget.style.color=t.accent;e.currentTarget.style.boxShadow=`0 4px 20px ${t.accent}33`;}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=t.cardBorder;e.currentTarget.style.color=t.textSecondary;e.currentTarget.style.boxShadow=t.shadow;}}>
                  ← Tweak
                </button>
                <button onClick={()=>{setResult(null);setIsSaved(false);setScreen("form");setTimeout(generate,50);}} disabled={loading} style={{
                  background:t.cardBg,border:`2px solid ${t.cardBorder}`,borderRadius:14,
                  padding:"15px",color:t.textSecondary,cursor:"pointer",
                  fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700,
                  transition:"all 0.25s",boxShadow:t.shadow,
                }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=t.accentLight;e.currentTarget.style.color=t.accentLight;e.currentTarget.style.boxShadow=`0 4px 20px ${t.accentLight}33`;}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=t.cardBorder;e.currentTarget.style.color=t.textSecondary;e.currentTarget.style.boxShadow=t.shadow;}}>
                  🔄 Regenerate
                </button>
                <button onClick={()=>{setShowShoppingList(true);setCheckedItems({});}} style={{
                  background:t.cardBg,border:`2px solid ${t.cardBorder}`,borderRadius:14,
                  padding:"15px",color:t.textSecondary,cursor:"pointer",
                  fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700,
                  transition:"all 0.25s",boxShadow:t.shadow,
                }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="#2d7a3a";e.currentTarget.style.color="#2d7a3a";e.currentTarget.style.boxShadow=`0 4px 20px #2d7a3a33`;}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=t.cardBorder;e.currentTarget.style.color=t.textSecondary;e.currentTarget.style.boxShadow=t.shadow;}}>
                  🛒 Shopping List
                </button>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:10}}>
                <button onClick={shareRecipe} style={{
                  background:t.cardBg,border:`2px solid ${t.cardBorder}`,borderRadius:14,
                  padding:"15px",color:t.textSecondary,cursor:"pointer",
                  fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700,
                  transition:"all 0.25s",boxShadow:t.shadow,
                }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="#1a6e8a";e.currentTarget.style.color="#1a6e8a";e.currentTarget.style.boxShadow=`0 4px 20px #1a6e8a33`;}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=t.cardBorder;e.currentTarget.style.color=t.textSecondary;e.currentTarget.style.boxShadow=t.shadow;}}>
                  📋 Copy Recipe
                </button>
                <button onClick={saveFavorite} disabled={isSaved} style={{
                  background:isSaved?"#2d7a3a":t.cardBg,
                  border:`2px solid ${isSaved?"#2d7a3a":t.spiceBorder}`,
                  borderRadius:14,padding:"15px",cursor:isSaved?"default":"pointer",
                  fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700,
                  color:isSaved?"#fff":t.spiceColor,
                  transition:"all 0.25s",boxShadow:isSaved?`0 6px 24px #2d7a3a55`:t.shadow,
                }}
                onMouseEnter={e=>{if(!isSaved){e.currentTarget.style.background=t.spiceColor;e.currentTarget.style.color="#fff";e.currentTarget.style.borderColor=t.spiceColor;e.currentTarget.style.boxShadow=`0 6px 24px ${t.spiceColor}44`;}}}
                onMouseLeave={e=>{if(!isSaved){e.currentTarget.style.background=t.cardBg;e.currentTarget.style.color=t.spiceColor;e.currentTarget.style.borderColor=t.spiceBorder;e.currentTarget.style.boxShadow=t.shadow;}}}>
                  {isSaved?"✓ Saved!":"⭐ Save Recipe"}
                </button>
              </div>

            </div>
            </div>
          )}
          </>}

          {/* ── SHOPPING LIST MODAL ── */}
          {showShoppingList&&result&&(
            <ShoppingList
              result={result}
              meatLabel={meatLabel}
              veggies={veggies}
              servings={servings}
              dark={dark}
              t={t}
              onClose={()=>setShowShoppingList(false)}
            />
          )}

          {/* ── TOAST ── */}
          {savedToast&&(
            <div style={{position:"fixed",bottom:32,left:"50%",transform:"translateX(-50%)",zIndex:9999,animation:"toastIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both",pointerEvents:"none"}}>
              <div style={{background:dark?"#161b24":"#fff",border:`2px solid #2d7a3a`,borderRadius:99,padding:"14px 28px",boxShadow:"0 16px 48px rgba(0,0,0,0.25)",display:"flex",alignItems:"center",gap:12}}>
                <span style={{fontSize:22}}>✅</span>
                <div>
                  <p style={{fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:700,color:"#2d7a3a",marginBottom:2}}>Recipe Saved!</p>
                  <p style={{fontSize:13,color:t.textMuted,fontWeight:500}}>View it in <strong style={{color:t.accent}}>My Recipes 📚</strong></p>
                </div>
              </div>
            </div>
          )}
          {shareToast&&(
            <div style={{position:"fixed",bottom:32,left:"50%",transform:"translateX(-50%)",zIndex:9999,animation:"toastIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both",pointerEvents:"none"}}>
              <div style={{background:dark?"#161b24":"#fff",border:`2px solid #1a6e8a`,borderRadius:99,padding:"14px 28px",boxShadow:"0 16px 48px rgba(0,0,0,0.25)",display:"flex",alignItems:"center",gap:12}}>
                <span style={{fontSize:22}}>📋</span>
                <div>
                  <p style={{fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:700,color:"#1a6e8a",marginBottom:2}}>Recipe Copied!</p>
                  <p style={{fontSize:13,color:t.textMuted,fontWeight:500}}>Paste it anywhere to share ✨</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}