import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────
   GLOBAL STYLES  (injected once into <head>)
───────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Anton&family=JetBrains+Mono:wght@400;500;700&family=Manrope:wght@300;400;500;600;700;800&display=swap');

  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  html { scroll-behavior:smooth; }

  :root {
    --bg:     #FAF7F2;
    --card:   #FFFFFF;
    --line:   #E6DECF;
    --orange: #D9601C;
    --ob:     #C2480F;
    --ink:    #261C13;
    --muted:  #6F6457;
  }

  body {
    background:var(--bg); color:var(--ink);
    font-family:'Manrope',sans-serif;
    overflow-x:hidden; -webkit-font-smoothing:antialiased;
  }
  ::selection { background:var(--orange); color:var(--bg); }
  a { color:inherit; text-decoration:none; }
  h1,h2,h3 { font-family:'Anton',sans-serif; font-weight:400; letter-spacing:.01em; line-height:.95; }

  /* layout */
  .hp-wrap { max-width:1180px; margin:0 auto; padding:0 32px; }
  @media(max-width:640px){ .hp-wrap{ padding:0 20px; } }

  /* eyebrow label */
  .eyebrow {
    font-family:'JetBrains Mono',monospace; font-size:.78rem;
    letter-spacing:.18em; text-transform:uppercase; color:var(--ob);
    display:flex; align-items:center; gap:10px;
  }
  .eyebrow::before { content:''; width:18px; height:1px; background:var(--orange); }
  .eyebrow.center  { justify-content:center; }
  .eyebrow.center::before { display:none; }

  /* ── NAV ── */
  .hp-header {
    position:fixed; top:0; left:0; right:0; z-index:50; padding:22px 0;
    backdrop-filter:blur(12px);
    background:linear-gradient(to bottom, rgba(250,247,242,.92), rgba(250,247,242,0));
    transition:background .3s;
  }
  .hp-header.solid { background:rgba(250,247,242,.97); }
  .hp-nav { display:flex; align-items:center; justify-content:space-between; }
  .hp-logo { font-family:'Anton',sans-serif; font-size:1.25rem; }
  .hp-logo span { color:var(--orange); }
  .hp-nav-links { display:flex; gap:36px; font-family:'JetBrains Mono',monospace; font-size:.76rem; letter-spacing:.08em; text-transform:uppercase; }
  .hp-nav-links a { position:relative; color:var(--muted); transition:color .25s; }
  .hp-nav-links a:hover { color:var(--ink); }
  .hp-nav-links a::after { content:''; position:absolute; left:0; bottom:-6px; width:0; height:1px; background:var(--orange); transition:width .25s; }
  .hp-nav-links a:hover::after { width:100%; }
  .hp-cta {
    font-family:'JetBrains Mono',monospace; font-size:.76rem;
    border:1px solid var(--orange); color:var(--ob);
    padding:9px 18px; border-radius:999px; transition:all .25s;
  }
  .hp-cta:hover { background:var(--orange); color:var(--bg); }
  @media(max-width:640px){ .hp-nav-links{display:none;} .hp-cta{font-size:.68rem;padding:7px 14px;} }

  /* ── HERO ── */
  .hp-hero {
    position:relative; min-height:100vh;
    display:flex; flex-direction:column; justify-content:center;
    padding-top:120px; padding-bottom:80px; overflow:hidden;
  }
  .hero-glow {
    position:absolute; inset:0; pointer-events:none;
    background:
      radial-gradient(circle at 20% 30%, rgba(217,96,28,.14), transparent 45%),
      radial-gradient(circle at 78% 68%, rgba(217,96,28,.10), transparent 50%);
  }
  .hero-svg { position:absolute; inset:0; z-index:1; pointer-events:none; }
  .hero-path {
    fill:none; stroke:url(#lg); stroke-width:2.2;
    filter:drop-shadow(0 0 9px rgba(217,96,28,.45));
    stroke-dasharray:2600; stroke-dashoffset:2600;
    animation:drawLine 3.2s cubic-bezier(.6,.05,.2,1) forwards;
  }
  @keyframes drawLine { to { stroke-dashoffset:0; } }
  .hero-content { position:relative; z-index:2; }

  .hero-title { font-size:clamp(3.2rem,9.5vw,7.4rem); }
  .hero-title .accent { color:var(--orange); }
  .hero-role {
    margin-top:14px; font-family:'JetBrains Mono',monospace;
    font-size:clamp(1rem,2.4vw,1.3rem); color:var(--muted); letter-spacing:.02em;
  }
  .blink-cursor {
    display:inline-block; width:9px; height:1.1em;
    background:var(--orange); margin-left:4px; vertical-align:middle;
    animation:blink 1s steps(1) infinite;
  }
  @keyframes blink { 50%{ opacity:0; } }
  .hero-sub { margin-top:26px; max-width:520px; color:var(--muted); font-size:1.02rem; line-height:1.7; font-weight:300; }

  .hero-actions { margin-top:40px; display:flex; gap:18px; flex-wrap:wrap; }
  .btn {
    font-family:'JetBrains Mono',monospace; font-size:.8rem; letter-spacing:.04em;
    padding:14px 26px; border-radius:999px; text-transform:uppercase;
    transition:all .25s; cursor:pointer; border:none; display:inline-block;
  }
  .btn-solid   { background:var(--orange); color:var(--bg); }
  .btn-solid:hover  { background:var(--ob); transform:translateY(-2px); }
  .btn-outline { background:transparent; border:1px solid var(--line) !important; color:var(--ink); }
  .btn-outline:hover { border-color:var(--orange) !important; color:var(--ob); }

  .hero-meta { margin-top:56px; display:flex; gap:52px; flex-wrap:wrap; }
  .m-num { font-family:'Anton',sans-serif; font-size:1.8rem; color:var(--ob); }
  .m-lbl { font-family:'JetBrains Mono',monospace; font-size:.68rem; letter-spacing:.1em; text-transform:uppercase; color:var(--muted); margin-top:4px; }

  .scroll-cue {
    position:absolute; bottom:36px; left:32px; z-index:2;
    display:flex; align-items:center; gap:10px;
    font-family:'JetBrains Mono',monospace; font-size:.7rem;
    letter-spacing:.1em; color:var(--muted); text-transform:uppercase;
  }
  .s-dot { width:6px; height:6px; border-radius:50%; background:var(--orange); animation:pulse 1.6s ease-in-out infinite; }
  @keyframes pulse { 0%,100%{ opacity:1; transform:translateY(0); } 50%{ opacity:.3; transform:translateY(4px); } }

  /* ── SECTIONS ── */
  .hp-sec { position:relative; padding:140px 0; }
  @media(max-width:640px){ .hp-sec{ padding:90px 0; } }
  .sec-border { border-top:1px solid var(--line); }
  .sec-head { display:flex; justify-content:space-between; align-items:flex-end; gap:24px; margin-bottom:64px; flex-wrap:wrap; }
  .sec-title { font-size:clamp(2.2rem,4.6vw,3.4rem); }
  .sec-title em { font-style:normal; color:var(--orange); }
  .sec-note { max-width:360px; color:var(--muted); font-weight:300; line-height:1.6; font-size:.95rem; }

  /* ── ABOUT ── */
  .about-grid { display:grid; grid-template-columns:1fr 1fr; gap:80px; align-items:center; }
  @media(max-width:860px){ .about-grid{ grid-template-columns:1fr; gap:48px; } }

  .terminal {
    border-radius:14px; border:1px solid var(--line); background:var(--card);
    overflow:hidden; box-shadow:0 8px 24px rgba(38,28,19,.06);
  }
  .t-bar { display:flex; gap:7px; padding:14px 16px; border-bottom:1px solid var(--line); }
  .t-circle { width:11px; height:11px; border-radius:50%; background:#D8C8A8; }
  .t-circle.o { background:var(--orange); }
  .t-body { padding:24px; font-family:'JetBrains Mono',monospace; font-size:.85rem; line-height:1.9; color:var(--muted); }
  .tk { color:var(--ob); } .ts { color:#8FA86E; } .tc { color:#A89B89; }

  .about-p { color:var(--muted); font-weight:300; line-height:1.8; font-size:1.02rem; margin-bottom:20px; }
  .about-p strong { color:var(--ink); font-weight:600; }
  .skill-tags { display:flex; flex-wrap:wrap; gap:10px; margin-top:28px; }
  .skill-tag {
    font-family:'JetBrains Mono',monospace; font-size:.72rem;
    border:1px solid var(--line); padding:8px 14px; border-radius:999px; color:var(--muted);
  }

  /* ── MARQUEE ── */
  .strip { border-top:1px solid var(--line); border-bottom:1px solid var(--line); padding:26px 0; overflow:hidden; }
  .strip-track { display:flex; gap:48px; white-space:nowrap; animation:marquee 24s linear infinite; width:max-content; }
  .strip-item { font-family:'Anton',sans-serif; font-size:1.5rem; color:var(--line); display:flex; align-items:center; gap:48px; }
  .strip-item em { font-style:normal; color:var(--orange); }
  @keyframes marquee { from{ transform:translateX(0); } to{ transform:translateX(-50%); } }

  /* ── PROJECTS ── */
  .work-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:28px; }
  @media(max-width:760px){ .work-grid{ grid-template-columns:1fr; } }
  .work-card {
    border-radius:16px; overflow:hidden;
    border:1px solid var(--line); background:var(--card);
    box-shadow:0 8px 24px rgba(38,28,19,.06);
  }
  .work-thumb { aspect-ratio:16/10; position:relative; background:linear-gradient(135deg,#F0E6D6,#E9DDC8); overflow:hidden; }
  .work-thumb img { width:100%; height:100%; object-fit:cover; display:block; transition:transform .4s ease; }
  .work-card:hover .work-thumb img { transform:scale(1.04); }
  .work-overlay {
    position:absolute; inset:0;
    background:linear-gradient(to top, rgba(38,28,19,.85), rgba(38,28,19,0) 55%);
    display:flex; align-items:flex-end; padding:22px;
    opacity:0; transition:opacity .35s;
  }
  .work-card:hover .work-overlay { opacity:1; }
  .work-tags { display:flex; gap:8px; flex-wrap:wrap; }
  .work-tag {
    font-family:'JetBrains Mono',monospace; font-size:.65rem; color:#FFC892;
    border:1px solid rgba(255,200,146,.4); padding:4px 9px; border-radius:999px;
    background:rgba(255,255,255,.08);
  }
  .work-info { display:flex; justify-content:space-between; align-items:center; padding:18px 24px 4px; gap:12px; }
  .work-name { font-family:'Anton',sans-serif; font-size:1.2rem; }
  .work-cat  { font-family:'JetBrains Mono',monospace; font-size:.66rem; color:var(--muted); letter-spacing:.08em; text-transform:uppercase; white-space:nowrap; }
  .work-desc { padding:0 24px 14px; font-size:.9rem; color:var(--muted); font-weight:300; line-height:1.55; }
  .work-links { display:flex; gap:14px; padding:0 24px 20px; }
  .work-link {
    font-family:'JetBrains Mono',monospace; font-size:.7rem; letter-spacing:.05em;
    text-transform:uppercase; color:var(--ob); border-bottom:1px solid var(--line);
    padding-bottom:2px; transition:border-color .2s, color .2s;
  }
  .work-link:hover { color:var(--orange); border-color:var(--orange); }

  /* ── EDUCATION ── */
  .edu-list { display:flex; flex-direction:column; }
  .edu-row {
    display:grid; grid-template-columns:140px 1fr 160px; gap:24px;
    padding:30px 0; border-bottom:1px solid var(--line);
    transition:padding-left .3s;
  }
  .edu-row:hover { padding-left:12px; }
  .edu-row:hover .edu-role { color:var(--ob); }
  .edu-time { font-family:'JetBrains Mono',monospace; font-size:.78rem; color:var(--muted); }
  .edu-role { font-family:'Anton',sans-serif; font-size:1.3rem; transition:color .3s; }
  .edu-co   { font-family:'JetBrains Mono',monospace; font-size:.8rem; color:var(--muted); margin-top:6px; }
  .edu-loc  { font-family:'JetBrains Mono',monospace; font-size:.74rem; color:var(--muted); text-align:right; }
  @media(max-width:700px){ .edu-row{ grid-template-columns:1fr; gap:6px; } .edu-loc{ text-align:left; } }

  /* ── CONTACT ── */
  .contact-glow {
    position:absolute; inset:0; pointer-events:none;
    background:radial-gradient(circle at 50% 100%, rgba(217,96,28,.14), transparent 60%);
  }
  .contact-inner { position:relative; z-index:1; text-align:center; }
  .contact-title { font-size:clamp(2.2rem,7vw,4.8rem); }
  .contact-title a { color:var(--orange); border-bottom:2px solid transparent; transition:border-color .3s; }
  .contact-title a:hover { border-color:var(--orange); }
  .contact-sub { color:var(--muted); margin-top:22px; font-weight:300; }
  .contact-links { display:flex; justify-content:center; gap:28px; margin-top:44px; flex-wrap:wrap; }
  .contact-links a {
    font-family:'JetBrains Mono',monospace; font-size:.76rem; letter-spacing:.06em;
    text-transform:uppercase; color:var(--muted); border-bottom:1px solid transparent;
    padding-bottom:4px; transition:all .25s;
  }
  .contact-links a:hover { color:var(--ob); border-color:var(--ob); }

  /* ── FOOTER ── */
  .hp-footer { border-top:1px solid var(--line); padding:28px 0; }
  .foot-row { display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;
    font-family:'JetBrains Mono',monospace; font-size:.72rem; color:var(--muted); }

  /* ── REVEAL ── */
  .reveal { opacity:0; transform:translateY(28px); transition:opacity .8s ease, transform .8s ease; }
  .reveal.in { opacity:1; transform:translateY(0); }

  @media(prefers-reduced-motion:reduce){ *{ animation:none!important; transition:none!important; } }
`;

if (!document.getElementById("hp-global-css")) {
  const s = document.createElement("style");
  s.id = "hp-global-css";
  s.textContent = CSS;
  document.head.appendChild(s);
}

/* ── Reveal on scroll ── */
function Reveal({ children, tag: Tag = "div", className = "", style }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("in"); io.unobserve(el); } },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <Tag ref={ref} className={`reveal ${className}`} style={style}>{children}</Tag>;
}

/* ── DATA ── */
const PROJECTS = [
  {
    title:  "DukaanSetu",
    desc:   "MERN e-commerce platform helping offline shopkeepers digitize their business. JWT auth, REST APIs, CRUD and responsive UI.",
    cat:    "College Project",
    stack:  ["React.js", "Node.js", "Express.js", "MongoDB"],
    image:  "./images/project1.png",   // 👈 replace with your image file name
    github: "https://github.com/HarshPatel2704",
    live:   "https://dukaansetu-nine.vercel.app/",
  },
  {
    title:  "ShareForCare",
    desc:   "Donation platform with authentication, admin panel, donation management and optimized database queries.",
    cat:    "College Project",
    stack:  ["PHP", "MySQL", "JavaScript"],
    image:  "../public/ShareForCare.png",   // 👈 replace with your image file name
    github: "https://github.com/HarshPatel2704",
    live:   "https://shareforcare.infinityfree.me/home.php?i=1",
  },
  {
    title:  "Online Society Management System",
    desc:   "Society management system with complaint, maintenance, resident and admin modules.",
    cat:    "College Project",
    stack:  ["PHP", "MySQL", "Bootstrap"],
    image:  "./images/project3.png",   // 👈 replace with your image file name
    github: "https://github.com/HarshPatel2704",
    live:   null,
  },
];

const EDUCATION = [
  { time: "2025 — 2027", role: "MCA — Master of Computer Applications", co: "D.Y. Patil Institute of MCA and Management, Pune",          loc: "Pune, IN"   },
  { time: "2022 — 2025", role: "BCA — Bachelor of Computer Applications", co: "Graduated · built a strong base in CS & web fundamentals", loc: "Surat, IN"  },
  { time: "Certified",   role: "C++  ·  Java  ·  C",                      co: "Programming language certifications — core fundamentals",  loc: "Self-paced" },
];

const SKILLS = ["React.js", "Node.js", "Express.js", "MongoDB", "JavaScript", "Tailwind CSS", "Bootstrap", "REST APIs", "MySQL", "Git/GitHub", "Postman"];
const STACK  = ["React.js", "Node.js", "Express.js", "MongoDB", "JavaScript", "Tailwind CSS"];

/* ═══════════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════════ */
export default function HarshPatelPortfolio() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const fn = () => setSolid(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      {/* ── HEADER ── */}
      <header className={`hp-header${solid ? " solid" : ""}`}>
        <div className="hp-wrap">
          <nav className="hp-nav">
            <a href="#top" className="hp-logo">HP<span>.</span></a>
            <div className="hp-nav-links">
              <a href="#about">About</a>
              <a href="#projects">Projects</a>
              <a href="#education">Education</a>
              <a href="#contact">Contact</a>
            </div>
            <a href="#contact" className="hp-cta">Hire me</a>
          </nav>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="hp-hero" id="top">
        <div className="hero-glow" />

        <svg className="hero-svg" viewBox="0 0 1180 760" preserveAspectRatio="none">
          <defs>
            <linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#D9601C" />
              <stop offset="50%"  stopColor="#F0924A" />
              <stop offset="100%" stopColor="#D9601C" />
            </linearGradient>
          </defs>
          <path className="hero-path"
            d="M -40,120 C 120,60 180,260 340,220 C 480,185 460,40 600,70
               C 760,105 700,300 860,300 C 1020,300 1000,120 1160,160
               C 1260,185 1240,420 1100,460 C 960,500 900,360 760,400
               C 620,440 660,600 500,620 C 360,638 320,520 180,560
               C 80,588 40,680 -40,690" />
        </svg>

        <div className="hp-wrap hero-content">
          <p className="eyebrow">Full Stack Developer · MERN Stack</p>

          <h1 className="hero-title">
            Harsh <span className="accent">Patel</span>
          </h1>

          <p className="hero-role">
            MCA @ DY Patil Pune · graduating 2027 <span className="blink-cursor" />
          </p>

          <p className="hero-sub">
            Full Stack Developer specializing in the MERN stack — React, Node,
            Express &amp; MongoDB. MCA student at DY Patil Pune with a BCA
            foundation and certifications in C, C++ &amp; Java.
          </p>

          <div className="hero-actions">
            <a href="#projects" className="btn btn-solid">View Projects</a>
            <a href="#contact"  className="btn btn-outline">Get in touch</a>
          </div>

          <div className="hero-meta">
            {[["03+","Projects Built"],["03","Certifications"],["02","Copyrights"]].map(
              ([n, l]) => (
                <div key={l}>
                  <div className="m-num">{n}</div>
                  <div className="m-lbl">{l}</div>
                </div>
              )
            )}
          </div>
        </div>

        <div className="scroll-cue">
          <span className="s-dot" /> Scroll to explore
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section className="hp-sec sec-border" id="about">
        <div className="hp-wrap">
          <Reveal>
            <div className="sec-head">
              <h2 className="sec-title">A bit <em>about</em> me</h2>
              <p className="sec-note">
                I like turning ambiguous requirements into shipped, working
                software — and making it look good along the way.
              </p>
            </div>
          </Reveal>

          <div className="about-grid">
            {/* terminal */}
            <Reveal>
              <div className="terminal">
                <div className="t-bar">
                  <span className="t-circle o" />
                  <span className="t-circle" />
                  <span className="t-circle" />
                </div>
                <div className="t-body">
                  <div><span className="tc">// whoami.js</span></div>
                  <div><span className="tk">const</span> developer = {"{"}</div>
                  <div>&nbsp;&nbsp;name: <span className="ts">'Harsh Patel'</span>,</div>
                  <div>&nbsp;&nbsp;degree: <span className="ts">'MCA @ DY Patil, Pune'</span>,</div>
                  <div>&nbsp;&nbsp;stack: [<span className="ts">'React'</span>, <span className="ts">'Node.js'</span>, <span className="ts">'Express'</span>, <span className="ts">'MongoDB'</span>],</div>
                  <div>&nbsp;&nbsp;certs: [<span className="ts">'C'</span>, <span className="ts">'C++'</span>, <span className="ts">'Java'</span>],</div>
                  <div>&nbsp;&nbsp;status: <span className="ts">'open to work'</span></div>
                  <div>{"}"};</div>
                  <div><span className="tk">export default</span> developer;</div>
                </div>
              </div>
            </Reveal>

            {/* bio */}
            <Reveal>
              <div>
                <p className="about-p">
                  I'm <strong>Harsh Patel</strong>, a Full Stack Developer focused
                  on the MERN stack. Currently pursuing my MCA at D.Y. Patil
                  Institute of MCA and Management, Pune (batch of 2027), with a
                  BCA under my belt and certifications in C, C++ and Java.
                </p>
                <p className="about-p">
                  I've built real-world projects like DukaanSetu (a MERN
                  e-commerce platform) and ShareForCare (a donation platform) —
                  both officially copyright registered. I'm the kind of developer
                  who reads the docs, builds the thing, breaks it, and then
                  actually fixes it. Open to full-time roles &amp; freelance work.
                </p>
                <div className="skill-tags">
                  {SKILLS.map(s => <span key={s} className="skill-tag">{s}</span>)}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="strip">
        <div className="strip-track">
          {[0, 1].map(i => (
            <span key={i} className="strip-item">
              {STACK.map((t, j) => (
                <span key={j} style={{ display:"inline-flex", alignItems:"center", gap:"48px" }}>
                  {t}{j < STACK.length - 1 && <em>•</em>}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ── PROJECTS ── */}
      <section className="hp-sec sec-border" id="projects">
        <div className="hp-wrap">
          <Reveal>
            <div className="sec-head">
              <h2 className="sec-title">Selected <em>projects</em></h2>
              <p className="sec-note">
                Real projects built during college — two of them officially
                copyright registered. Source &amp; live links below.
              </p>
            </div>
          </Reveal>

          <div className="work-grid">
            {PROJECTS.map(p => (
              <Reveal key={p.title}>
                <div className="work-card">
                  <div className="work-thumb">
                    {p.svg}
                    <div className="work-overlay">
                      <div className="work-tags">
                        {p.stack.map(t => <span key={t} className="work-tag">{t}</span>)}
                      </div>
                    </div>
                  </div>
                  <div className="work-info">
                    <span className="work-name">{p.title}</span>
                    <span className="work-cat">{p.cat}</span>
                  </div>
                  <p className="work-desc">{p.desc}</p>
                  <div className="work-links">
                    {p.live && <a className="work-link" href={p.live} target="_blank" rel="noreferrer">Live Demo</a>}
                    <a className="work-link" href={p.github} target="_blank" rel="noreferrer">Source</a>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── EDUCATION ── */}
      <section className="hp-sec sec-border" id="education">
        <div className="hp-wrap">
          <Reveal>
            <div className="sec-head">
              <h2 className="sec-title">Education &amp; <em>journey</em></h2>
              <p className="sec-note">
                MCA in progress at DY Patil Pune, BCA under my belt — plus
                certifications in C, C++ &amp; Java to back up the fundamentals.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div className="edu-list">
              {EDUCATION.map(e => (
                <div key={e.role} className="edu-row">
                  <span className="edu-time">{e.time}</span>
                  <div>
                    <div className="edu-role">{e.role}</div>
                    <div className="edu-co">{e.co}</div>
                  </div>
                  <span className="edu-loc">{e.loc}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section className="hp-sec sec-border" id="contact" style={{ position:"relative", overflow:"hidden" }}>
        <div className="contact-glow" />
        <div className="hp-wrap contact-inner">
          <Reveal>
            <p className="eyebrow center">Get in touch</p>
            <h2 className="contact-title">
              Got an idea?<br />
              <a href="mailto:hp210522@gmail.com">Let's build it.</a>
            </h2>
            <p className="contact-sub">
              Open to full-stack roles &amp; freelance work · MCA student, Pune ·
              based in Surat, India.
            </p>
            <div className="contact-links">
              <a href="https://github.com/HarshPatel2704" target="_blank" rel="noreferrer">GitHub</a>
              <a href="https://www.linkedin.com/in/harsh-patel-8b83862b1/" target="_blank" rel="noreferrer">LinkedIn</a>
              <a href="mailto:hp210522@gmail.com">Email</a>
              <a href="./Resume.pdf" target="_blank" rel="noreferrer">Resume</a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="hp-footer">
        <div className="hp-wrap foot-row">
          <span>© 2026 Harsh Patel. All rights reserved.</span>
          <span>Built with React &amp; a lot of coffee.</span>
        </div>
      </footer>
    </>
  );
}