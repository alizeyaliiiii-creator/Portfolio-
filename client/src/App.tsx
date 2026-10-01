import { useState } from 'react';
import { ContentProvider, useContent, Lines, Rich } from './content';
import img9881 from '@/imports/IMG_9881.jpeg';
import img9878 from '@/imports/IMG_9878.jpeg';
import img3395 from '@/imports/IMG_3395.jpeg';
import img9880 from '@/imports/IMG_9880-1.jpeg';

// ─── Palette ──────────────────────────────────────────────────────────────────
const P = {
  sage:    '#818263',
  avocado: '#C2C395',
  blush:   '#DDBAAE',
  peach:   '#EFD7CF',
  oat:     '#DCD4C1',
  honey:   '#F6E7B4',
  cream:   '#FFF8F2',
} as const;

// ─── Wavy Stripes SVG ─────────────────────────────────────────────────────────
function WavyStripes({ a = P.blush, b = P.avocado, sw = 28 }: { a?: string; b?: string; sw?: number }) {
  const W = 1440, H = 1000;
  const count = Math.ceil(W / sw) + 2;
  const stripe = (i: number) => {
    const x0 = i * sw, ph = i * 1.2, amp = 3.8, steps = 28;
    const pts: string[] = [];
    for (let s = 0; s <= steps; s++) {
      const y = (s / steps) * H;
      pts.push(`${(x0 + Math.sin(y * 0.043 + ph) * amp).toFixed(2)},${y}`);
    }
    for (let s = steps; s >= 0; s--) {
      const y = (s / steps) * H;
      pts.push(`${(x0 + sw + Math.sin(y * 0.043 + ph + 2.2) * amp).toFixed(2)},${y}`);
    }
    return pts.join(' ');
  };
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <polygon key={i} points={stripe(i)} fill={i % 2 === 0 ? a : b} />
      ))}
    </svg>
  );
}

// ─── Ribbon Banner ────────────────────────────────────────────────────────────
function RibbonBanner({ label, rot = -4, bg = P.sage, fg = P.cream }: {
  label: string; rot?: number; bg?: string; fg?: string;
}) {
  return (
    <div style={{ transform: `rotate(${rot}deg)`, display: 'inline-block' }}>
      <svg viewBox="0 0 246 52" width={246} height={52} aria-label={label}>
        <path d="M0 6 Q6 0 12 0 L222 0 L246 26 L222 52 L12 52 Q6 52 0 46Z" fill={bg} />
        <text x="118" y="32" textAnchor="middle" fill={fg}
          style={{ font: "600 13px 'Space Grotesk',sans-serif", letterSpacing: '2.5px' }}>
          {label.toUpperCase()}
        </text>
      </svg>
    </div>
  );
}

// ─── Scalloped Oval Badge ─────────────────────────────────────────────────────
function sOval(cx: number, cy: number, rx: number, ry: number, n: number, sr: number) {
  const pts = Array.from({ length: n }, (_, i) => {
    const t = (i / n) * 2 * Math.PI - Math.PI / 2;
    return { x: cx + rx * Math.cos(t), y: cy + ry * Math.sin(t) };
  });
  return pts.map((p, i) => {
    const nx = pts[(i + 1) % n];
    return (i === 0 ? `M${p.x.toFixed(1)} ${p.y.toFixed(1)}` : '')
      + ` A${sr} ${sr} 0 0 1 ${nx.x.toFixed(1)} ${nx.y.toFixed(1)}`;
  }).join('') + 'Z';
}

function ScallopBadge({ children, fill = P.honey, color = P.sage }: {
  children: React.ReactNode; fill?: string; color?: string;
}) {
  return (
    <div className="relative inline-flex items-center justify-center"
      style={{ width: 174, height: 78 }}>
      <svg viewBox="0 0 174 78" className="absolute inset-0 w-full h-full">
        <path d={sOval(87, 39, 79, 31, 18, 21)} fill={fill} />
      </svg>
      <span className="relative z-10 text-center px-4"
        style={{ color, font: "600 12px/1.3 'Space Grotesk',sans-serif", maxWidth: 140 }}>
        {children}
      </span>
    </div>
  );
}

// ─── Stamp Badge (postage stamp style, for stats) ─────────────────────────────
function StampBadge({ stat, label, fill = P.honey, bg = P.sage, color = P.sage }: {
  stat: string; label: string; fill?: string; bg?: string; color?: string;
}) {
  const W = 140, H = 84, r = 7.5, step = 18;
  const tx = Array.from({ length: Math.ceil((W - r) / step) }, (_, i) => r + i * step).filter(x => x < W - r / 2);
  const sy = Array.from({ length: Math.ceil((H - r) / step) }, (_, i) => r + i * step).filter(y => y < H - r / 2);
  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center',
      justifyContent: 'center', width: W, height: H }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <rect x={r} y={r} width={W - 2 * r} height={H - 2 * r} rx="2" fill={fill} />
        {tx.map(x => (
          <g key={`h${x}`}>
            <circle cx={x} cy={0} r={r} fill={bg} />
            <circle cx={x} cy={H} r={r} fill={bg} />
          </g>
        ))}
        {sy.map(y => (
          <g key={`v${y}`}>
            <circle cx={0} cy={y} r={r} fill={bg} />
            <circle cx={W} cy={y} r={r} fill={bg} />
          </g>
        ))}
      </svg>
      <div className="relative z-10 flex flex-col items-center" style={{ gap: 2 }}>
        <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 40, lineHeight: 1, color }}>{stat}</span>
        <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 10, fontWeight: 600,
          color, letterSpacing: '1px', textTransform: 'uppercase', textAlign: 'center', lineHeight: 1.2 }}>
          {label}
        </span>
      </div>
    </div>
  );
}

// ─── Polaroid Frame ───────────────────────────────────────────────────────────
function Polaroid({ src, alt, caption, rotate = 0, size = 200, className = '' }: {
  src: string; alt: string; caption?: string; rotate?: number; size?: number; className?: string;
}) {
  const pad = 10, bot = caption ? 44 : 34;
  return (
    <div className={`bg-white shadow-xl ${className}`} style={{
      transform: `rotate(${rotate}deg)`,
      padding: `${pad}px ${pad}px ${bot}px`,
      display: 'inline-block',
      boxShadow: '3px 4px 18px rgba(0,0,0,0.18)',
    }}>
      <img src={src} alt={alt}
        style={{ width: size, height: size, objectFit: 'cover', display: 'block' }} />
      {caption && (
        <p style={{ fontFamily: "'Caveat',cursive", fontSize: 16, color: P.sage,
          textAlign: 'center', marginTop: 8, lineHeight: 1.2 }}>
          {caption}
        </p>
      )}
    </div>
  );
}

// ─── Star Sticker ─────────────────────────────────────────────────────────────
function StarSticker({ size = 36, rotate = 0 }: { size?: number; rotate?: number }) {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const r = i % 2 === 0 ? size / 2 : size / 4.5;
    const a = (i * Math.PI) / 5 - Math.PI / 2;
    return `${(size / 2 + r * Math.cos(a)).toFixed(1)},${(size / 2 + r * Math.sin(a)).toFixed(1)}`;
  }).join(' ');
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true"
      style={{ transform: `rotate(${rotate}deg)`, display: 'block' }}>
      <polygon points={pts} fill={P.honey} stroke={P.sage} strokeWidth="1" />
    </svg>
  );
}

// ─── Pill Button ──────────────────────────────────────────────────────────────
function PillBtn({ children, href, variant = 'solid', onClick }: {
  children: React.ReactNode; href?: string; variant?: 'solid' | 'outline'; onClick?: () => void;
}) {
  const base: React.CSSProperties = {
    fontFamily: "'Space Grotesk',sans-serif", fontSize: 13, fontWeight: 600,
    letterSpacing: '1.8px', padding: '13px 28px', borderRadius: 9999,
    cursor: 'pointer', display: 'inline-block', textDecoration: 'none',
    border: '2px solid', transition: 'all 0.18s ease', textTransform: 'uppercase',
  };
  const styles: Record<string, React.CSSProperties> = {
    solid:   { ...base, backgroundColor: P.sage, borderColor: P.sage, color: P.cream },
    outline: { ...base, backgroundColor: 'transparent', borderColor: P.sage, color: P.sage },
  };
  if (href) return <a href={href} style={styles[variant]}>{children}</a>;
  return <button style={styles[variant]} onClick={onClick}>{children}</button>;
}

// ─── Quilted Diamond Pattern ──────────────────────────────────────────────────
function QuiltPattern({ color = P.sage }: { color?: string }) {
  return (
    <svg className="w-full h-full" aria-hidden="true">
      <defs>
        <pattern id="quilt" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M16 1 L31 16 L16 31 L1 16Z" fill="none" stroke={color} strokeWidth="1.2" />
          <circle cx="16" cy="16" r="1.8" fill={color} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#quilt)" />
    </svg>
  );
}

// ─── Process Strip ────────────────────────────────────────────────────────────
function ProcessStrip({ steps }: { steps: string[] }) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-1">
          <div style={{
            backgroundColor: i % 2 === 0 ? P.honey : P.oat,
            color: P.sage,
            fontFamily: "'Space Grotesk',sans-serif",
            fontSize: 11, fontWeight: 600, letterSpacing: '1px',
            padding: '6px 14px', borderRadius: 9999,
            textTransform: 'uppercase',
          }}>{s}</div>
          {i < steps.length - 1 && (
            <span style={{ color: P.sage, fontFamily: "'Caveat',cursive", fontSize: 18, opacity: 0.6 }}>→</span>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
function Nav() {
  const { site } = useContent();
  const [open, setOpen] = useState(false);
  const links = [
    { label: 'About', href: '#about' },
    { label: 'Work',  href: '#work'  },
    { label: 'Contact', href: '#contact' },
  ];
  return (
    <nav style={{ backgroundColor: P.sage, position: 'sticky', top: 0, zIndex: 50 }}>
      <div className="flex items-center justify-between px-6 md:px-12" style={{ height: 56 }}>
        <a href="#hero" style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 600,
          color: P.cream, textDecoration: 'none', letterSpacing: '0.5px' }}>
          {site.name}
        </a>
        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <a key={l.label} href={l.href} style={{
              fontFamily: "'Space Grotesk',sans-serif", fontSize: 12, fontWeight: 600,
              color: P.cream, textDecoration: 'none', letterSpacing: '2px', textTransform: 'uppercase',
              opacity: 0.9, transition: 'opacity 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '0.9')}>
              {l.label}
            </a>
          ))}
          <a href={`mailto:${site.email}`} style={{
            fontFamily: "'Space Grotesk',sans-serif", fontSize: 11, fontWeight: 600,
            color: P.sage, backgroundColor: P.honey, padding: '7px 18px', borderRadius: 9999,
            textDecoration: 'none', letterSpacing: '1.5px', textTransform: 'uppercase',
          }}>Hire Me</a>
        </div>
        {/* Mobile hamburger */}
        <button className="md:hidden flex flex-col gap-1.5" onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          {[0, 1, 2].map(i => (
            <span key={i} style={{ display: 'block', width: 22, height: 2,
              backgroundColor: P.cream, borderRadius: 2, transition: 'all 0.2s',
              ...(open && i === 0 ? { transform: 'rotate(45deg) translate(4px,4px)' } : {}),
              ...(open && i === 1 ? { opacity: 0 } : {}),
              ...(open && i === 2 ? { transform: 'rotate(-45deg) translate(4px,-4px)' } : {}),
            }} />
          ))}
        </button>
      </div>
      {/* Mobile menu */}
      {open && (
        <div style={{ backgroundColor: P.sage, borderTop: `1px solid rgba(255,248,242,0.15)`, padding: '16px 24px 20px' }}>
          {links.map(l => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)} style={{
              display: 'block', fontFamily: "'Space Grotesk',sans-serif", fontSize: 13, fontWeight: 600,
              color: P.cream, textDecoration: 'none', letterSpacing: '2px', textTransform: 'uppercase',
              padding: '10px 0', borderBottom: `1px solid rgba(255,248,242,0.1)`,
            }}>{l.label}</a>
          ))}
        </div>
      )}
    </nav>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
function Site() {
  const { site, hero, about, pillars: [p1, p2, p3], contact } = useContent();
  return (
    <div style={{ overflowX: 'hidden' }}>
      <Nav />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section id="hero" style={{ position: 'relative', minHeight: '100vh',
        backgroundColor: P.blush, overflow: 'hidden' }}>
        <WavyStripes />
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start"
          style={{ minHeight: '100vh', padding: '80px 40px 80px 48px', gap: 40, maxWidth: 1200, margin: '0 auto' }}>

          {/* Left: text */}
          <div className="flex-1 flex flex-col justify-center" style={{ paddingTop: 20 }}>
            {/* Overline */}
            <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 12, fontWeight: 600,
              letterSpacing: '3px', textTransform: 'uppercase', color: P.sage,
              marginBottom: 16, opacity: 0.8 }}>
              {hero.overline}
            </p>

            {/* Name — Bebas Neue, massive */}
            <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(72px, 14vw, 148px)',
              lineHeight: 0.9, color: P.sage, margin: 0, letterSpacing: '2px' }}>
              {site.name.split(' ')[0]}<br />{site.name.split(' ').slice(1).join(' ')}
            </h1>

            {/* Script tagline */}
            <p style={{ fontFamily: "'Caveat',cursive", fontSize: 'clamp(24px, 4vw, 34px)',
              color: P.sage, marginTop: 16, marginBottom: 8, transform: 'rotate(-3deg)',
              transformOrigin: 'left center', paddingLeft: 4 }}>
              {hero.tagline}
            </p>

            {/* Positioning */}
            <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 15, fontWeight: 400,
              color: P.sage, lineHeight: 1.65, maxWidth: 420, marginBottom: 40, opacity: 0.85 }}>
              {hero.positioning}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <PillBtn href="#work">See the Work</PillBtn>
              <PillBtn href="#contact" variant="outline">Get in Touch</PillBtn>
            </div>
          </div>

          {/* Right: polaroid collage */}
          <div className="relative flex-shrink-0" style={{ width: 380, height: 440, marginTop: 40 }}>
            {/* Background polaroid (peeking) */}
            <div style={{ position: 'absolute', top: 20, left: 0, zIndex: 1 }}>
              <Polaroid
                src={img9878}
                alt="Social media content strategy planning"
                rotate={-7}
                size={170}
              />
            </div>
            {/* Main polaroid */}
            <div style={{ position: 'absolute', top: 55, left: 100, zIndex: 3 }}>
              <Polaroid
                src={img9881}
                alt="Content creator filming"
                caption="creating ✦"
                rotate={3}
                size={210}
              />
            </div>
            {/* Third polaroid */}
            <div style={{ position: 'absolute', top: 240, left: 10, zIndex: 2 }}>
              <Polaroid
                src="https://images.unsplash.com/photo-1676276375742-9e3d10e39d45?w=320&h=320&fit=crop&auto=format"
                alt="Strategy board with post-it notes"
                caption="strategising"
                rotate={-4}
                size={150}
              />
            </div>
            {/* Star sticker */}
            <div style={{ position: 'absolute', top: 228, left: 272, zIndex: 4 }}>
              <StarSticker size={40} rotate={12} />
            </div>
            {/* Script label tucked near collage */}
            <div style={{ position: 'absolute', bottom: -16, right: -20, zIndex: 5,
              transform: 'rotate(-5deg)' }}>
              <RibbonBanner label="The Portfolio" rot={0} bg={P.honey} fg={P.sage} />
            </div>
          </div>
        </div>

        {/* Section bleed strip — bleeds 24px into About */}
        <div style={{ position: 'absolute', bottom: -20, left: 0, right: 0, height: 24,
          background: `repeating-linear-gradient(90deg, ${P.blush} 0px, ${P.blush} 14px, ${P.avocado} 14px, ${P.avocado} 28px)`,
          zIndex: 20 }} />
      </section>

      {/* ── ABOUT ─────────────────────────────────────────────────────────── */}
      <section id="about" style={{ backgroundColor: P.cream, paddingTop: 64, paddingBottom: 80 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px' }}>
          {/* Ribbon label */}
          <div style={{ marginBottom: 56 }}>
            <RibbonBanner label="About Me" rot={-3} />
          </div>

          <div className="flex flex-col md:flex-row gap-12 md:gap-20 items-start">
            {/* Left: bio */}
            <div className="flex-1">
              <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 'clamp(38px, 5vw, 58px)',
                fontWeight: 600, fontStyle: 'italic', color: P.sage, lineHeight: 1.1,
                marginBottom: 28, marginTop: 0 }}>
                <Lines text={about.headline} />
              </h2>
              <p style={{ fontSize: 15, lineHeight: 1.75, color: P.sage, opacity: 0.9,
                marginBottom: 20, maxWidth: 480, fontWeight: 700 }}>
                {about.paragraphs[0]}
              </p>
              <p style={{ fontSize: 15, lineHeight: 1.75, color: P.sage, opacity: 0.85,
                marginBottom: 36, maxWidth: 480, fontWeight: 700 }}>
                {about.paragraphs[1]}
              </p>

              {/* Competency scallop badges */}
              <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 11, fontWeight: 600,
                letterSpacing: '2.5px', textTransform: 'uppercase', color: P.sage, opacity: 0.6,
                marginBottom: 16 }}>Core Capabilities</h3>
              <div className="flex flex-wrap gap-3" style={{ marginBottom: 40 }}>
                {about.capabilities.map((cap, i) => (
                  <ScallopBadge key={cap} fill={i % 2 === 0 ? P.honey : P.oat}>{cap}</ScallopBadge>
                ))}
              </div>

              {/* Tools */}
              <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 11, fontWeight: 600,
                letterSpacing: '2.5px', textTransform: 'uppercase', color: P.sage, opacity: 0.6,
                marginBottom: 14 }}>Tools & Platforms</h3>
              <div className="flex flex-wrap gap-2">
                {about.tools.map(t => (
                  <span key={t} style={{
                    fontFamily: "'Space Grotesk',sans-serif", fontSize: 12, fontWeight: 500,
                    color: P.sage, backgroundColor: P.peach,
                    padding: '5px 14px', borderRadius: 9999, letterSpacing: '0.3px',
                  }}>{t}</span>
                ))}
              </div>
            </div>

            {/* Right: quilted photo frame */}
            <div className="flex-shrink-0" style={{ position: 'relative' }}>
              <div style={{ position: 'relative', width: 320, height: 360 }}>
                {/* Quilted diamond pattern behind photo */}
                <div style={{ position: 'absolute', inset: -16, zIndex: 0, borderRadius: 4, overflow: 'hidden', opacity: 0.18 }}>
                  <QuiltPattern color={P.sage} />
                </div>
                {/* Main photo */}
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <Polaroid
                    src={img3395}
                    alt="Creative professional working"
                    caption={about.photoCaption}
                    rotate={2}
                    size={295}
                  />
                </div>
                {/* Small accent sticker */}
                <div style={{ position: 'absolute', bottom: -12, right: -14, zIndex: 3 }}>
                  <StarSticker size={34} rotate={-8} />
                </div>
                {/* Script caption floating */}
                <p style={{ fontFamily: "'Caveat',cursive", fontSize: 20, color: P.sage,
                  position: 'absolute', bottom: -44, left: 12, transform: 'rotate(-3deg)',
                  whiteSpace: 'nowrap', opacity: 0.7 }}>
                  {about.location}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WORK INTRO BAND ────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', overflow: 'hidden', height: 140 }}>
        <WavyStripes a={P.sage} b={P.avocado} sw={30} />
        <div className="relative z-10 flex items-center justify-center h-full">
          <RibbonBanner label="How I Work" rot={-2} bg={P.honey} fg={P.sage} />
        </div>
      </div>

      {/* ── WORK ──────────────────────────────────────────────────────────── */}
      <section id="work">

        {/* Pillar 1 — Brand & Campaign Strategy */}
        <div style={{ backgroundColor: P.oat, padding: '88px 0 80px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px' }}>
            <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-start">
              <div className="flex-1">
                {/* Section number */}
                <p style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 72,
                  color: P.blush, lineHeight: 1, margin: '0 0 -8px', letterSpacing: '2px' }}>01</p>
                <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 'clamp(30px, 4vw, 46px)',
                  fontWeight: 900, color: P.sage, lineHeight: 1.1, margin: '0 0 20px' }}>
                  {p1.title}
                </h2>
                <p style={{ fontFamily: "'Caveat',cursive", fontSize: 20, color: P.sage,
                  marginBottom: 24, opacity: 0.75, transform: 'rotate(-1.5deg)', display: 'inline-block' }}>
                  {p1.subtitle}
                </p>
                <p style={{ fontSize: 15, lineHeight: 1.8, color: P.sage, opacity: 0.88,
                  marginBottom: 18, maxWidth: 540 }}>
                  <Rich text={p1.paragraphs[0]} />
                </p>
                <p style={{ fontSize: 15, lineHeight: 1.8, color: P.sage, opacity: 0.88,
                  marginBottom: 32, maxWidth: 540 }}>
                  <Rich text={p1.paragraphs[1]} />
                </p>
                {/* Process strip */}
                <ProcessStrip steps={p1.process ?? []} />
              </div>

              {/* Right: polaroid */}
              <div className="flex-shrink-0 flex flex-col items-center gap-6" style={{ paddingTop: 40 }}>
                <Polaroid
                  src="https://images.unsplash.com/photo-1676276375742-9e3d10e39d45?w=480&h=480&fit=crop&auto=format"
                  alt="Campaign strategy planning board"
                  caption={p1.photoCaption}
                  rotate={-5}
                  size={240}
                />
                {/* Accent scallop quote */}
                <div style={{ maxWidth: 240, textAlign: 'center' }}>
                  <ScallopBadge fill={P.blush} color={P.sage}>
                    {p1.badge}
                  </ScallopBadge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pillar 2 — Narrative & Content Storytelling */}
        <div style={{ backgroundColor: P.peach, padding: '88px 0 80px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px' }}>
            <div className="flex flex-col md:flex-row-reverse gap-12 md:gap-16 items-start">
              <div className="flex-1">
                <p style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 72,
                  color: P.avocado, lineHeight: 1, margin: '0 0 -8px', letterSpacing: '2px' }}>02</p>
                <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 'clamp(30px, 4vw, 46px)',
                  fontWeight: 900, color: P.sage, lineHeight: 1.1, margin: '0 0 20px' }}>
                  {p2.title}
                </h2>
                <p style={{ fontFamily: "'Caveat',cursive", fontSize: 20, color: P.sage,
                  marginBottom: 24, opacity: 0.75, transform: 'rotate(-1.5deg)', display: 'inline-block' }}>
                  {p2.subtitle}
                </p>
                <p style={{ fontSize: 15, lineHeight: 1.8, color: P.sage, opacity: 0.88,
                  marginBottom: 18, maxWidth: 540 }}>
                  <Rich text={p2.paragraphs[0]} />
                </p>
                <p style={{ fontSize: 15, lineHeight: 1.8, color: P.sage, opacity: 0.88,
                  marginBottom: 32, maxWidth: 540 }}>
                  <Rich text={p2.paragraphs[1]} />
                </p>
                {/* Platform tags */}
                <div className="flex gap-3 flex-wrap">
                  {(p2.tags ?? []).map(p => (
                    <div key={p} style={{
                      fontFamily: "'Space Grotesk',sans-serif", fontSize: 12, fontWeight: 600,
                      color: P.sage, backgroundColor: P.honey,
                      padding: '7px 16px', borderRadius: 9999,
                    }}>{p}</div>
                  ))}
                </div>
              </div>

              {/* Left: photo + script pullquote */}
              <div className="flex-shrink-0 flex flex-col items-start gap-4" style={{ paddingTop: 40 }}>
                <Polaroid
                  src={img9880}
                  alt="Social media content strategy"
                  caption={p2.photoCaption}
                  rotate={4}
                  size={230}
                />
                <p style={{ fontFamily: "'Caveat',cursive", fontSize: 22, color: P.sage,
                  transform: 'rotate(-4deg)', transformOrigin: 'left center',
                  maxWidth: 220, lineHeight: 1.4, opacity: 0.8, paddingLeft: 12 }}>
                  {p2.pullquote}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pillar 3 — Platform Growth & Analytics (dark sage section) */}
        <div style={{ backgroundColor: P.sage, padding: '88px 0 80px', position: 'relative' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px' }}>
            <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-start">
              <div className="flex-1">
                <p style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 72,
                  color: P.honey, lineHeight: 1, margin: '0 0 -8px', letterSpacing: '2px', opacity: 0.5 }}>03</p>
                <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 'clamp(30px, 4vw, 46px)',
                  fontWeight: 900, color: P.honey, lineHeight: 1.1, margin: '0 0 20px' }}>
                  {p3.title}
                </h2>
                <p style={{ fontFamily: "'Caveat',cursive", fontSize: 20, color: P.cream,
                  marginBottom: 24, opacity: 0.8, transform: 'rotate(-1.5deg)', display: 'inline-block' }}>
                  {p3.subtitle}
                </p>
                <p style={{ fontSize: 15, lineHeight: 1.8, color: P.cream, opacity: 0.9,
                  marginBottom: 18, maxWidth: 540 }}>
                  <Rich text={p3.paragraphs[0]} />
                </p>
                <p style={{ fontSize: 15, lineHeight: 1.8, color: P.cream, opacity: 0.85,
                  marginBottom: 40, maxWidth: 540 }}>
                  <Rich text={p3.paragraphs[1]} />
                </p>

                {/* Stats — StampBadge trio */}
                <div className="flex flex-wrap gap-6 items-center">
                  {(p3.stats ?? []).map((st, i) => (
                    <StampBadge key={st.label} stat={st.stat} label={st.label}
                      fill={[P.honey, P.oat, P.blush][i % 3]} bg={P.sage} color={P.sage} />
                  ))}
                </div>
                <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 11, fontWeight: 400,
                  color: P.cream, opacity: 0.5, marginTop: 12, letterSpacing: '0.5px' }}>
                  {p3.statNote}
                </p>
              </div>

              {/* Right: coffee photo */}
              <div className="flex-shrink-0 flex flex-col items-center gap-4" style={{ paddingTop: 40 }}>
                <div style={{ position: 'relative' }}>
                  <Polaroid
                    src="https://images.unsplash.com/photo-1728761390316-935ffeb3fbcc?w=480&h=480&fit=crop&auto=format"
                    alt="Cozy Bean Machine café"
                    caption={p3.photoCaption}
                    rotate={-3}
                    size={240}
                  />
                  {/* Star tucked behind */}
                  <div style={{ position: 'absolute', top: -14, right: -14, zIndex: 0 }}>
                    <StarSticker size={44} rotate={20} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bleed strip into Contact */}
          <div style={{ position: 'absolute', bottom: -18, left: 0, right: 0, height: 20,
            background: `repeating-linear-gradient(90deg, ${P.sage} 0px, ${P.sage} 14px, ${P.avocado} 14px, ${P.avocado} 28px)`,
            zIndex: 20 }} />
        </div>

      </section>

      {/* ── CONTACT ───────────────────────────────────────────────────────── */}
      <section id="contact" style={{ position: 'relative', backgroundColor: P.blush,
        overflow: 'hidden', padding: '110px 48px 100px' }}>
        <WavyStripes a={P.blush} b={P.peach} sw={24} />
        <div className="relative z-10 flex flex-col items-center text-center" style={{ maxWidth: 680, margin: '0 auto' }}>
          {/* Ribbon label */}
          <div style={{ marginBottom: 32 }}>
            <RibbonBanner label="Say Hi" rot={-3} />
          </div>

          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 'clamp(44px, 8vw, 88px)',
            fontWeight: 900, color: P.sage, lineHeight: 1.0, margin: '0 0 16px' }}>
            {(() => {
              const [first, ...rest] = contact.heading.split('\n');
              return <>{first}<br /><em>{rest.join(' ')}</em></>;
            })()}
          </h2>

          <p style={{ fontFamily: "'Caveat',cursive", fontSize: 26, color: P.sage,
            marginBottom: 32, transform: 'rotate(-2deg)', opacity: 0.8 }}>
            {contact.script}
          </p>

          <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 15, lineHeight: 1.7,
            color: P.sage, opacity: 0.85, marginBottom: 44, maxWidth: 420 }}>
            {contact.body}
          </p>

          {/* CTA */}
          <div className="flex flex-wrap justify-center gap-4" style={{ marginBottom: 36 }}>
            <PillBtn href={`mailto:${site.email}`}>{site.email}</PillBtn>
            <PillBtn href={site.linkedin} variant="outline">LinkedIn</PillBtn>
          </div>

          {/* Script final line */}
          <p style={{ fontFamily: "'Caveat',cursive", fontSize: 18, color: P.sage,
            opacity: 0.55, transform: 'rotate(-1deg)' }}>
            {contact.closing}
          </p>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer style={{ backgroundColor: P.sage }}>
        {/* Mini stripe strip */}
        <div style={{ height: 10,
          background: `repeating-linear-gradient(90deg, ${P.blush} 0px, ${P.blush} 10px, ${P.avocado} 10px, ${P.avocado} 20px)` }} />
        <div className="flex flex-col md:flex-row items-center justify-between"
          style={{ padding: '20px 48px', gap: 12 }}>
          <p style={{ fontFamily: "'Fraunces',serif", fontSize: 14, color: P.cream,
            opacity: 0.7, margin: 0, fontStyle: 'italic' }}>
            {site.name}
          </p>
          <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 11, color: P.cream,
            opacity: 0.45, margin: 0, letterSpacing: '1px' }}>
            {site.footer}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ContentProvider>
      <Site />
    </ContentProvider>
  );
}
