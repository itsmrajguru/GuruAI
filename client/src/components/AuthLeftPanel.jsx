export default function AuthLeftPanel() {
  return (
    <>
      <div className="login-orb login-orb-1" />
      <div className="login-orb login-orb-2" />
      
      {/* LEFT — Mandala Panel */}
      <div className="login-left fade-up">
        <div className="login-mandala-wrap">
          <svg className="login-mandala" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="80" cy="80" r="74" stroke="#f07d07" strokeWidth="0.8" strokeDasharray="4 3" opacity="0.35" className="spin-slow"/>
            <circle cx="80" cy="80" r="58" stroke="#ffd9a0" strokeWidth="0.8" opacity="0.5"/>
            <circle cx="80" cy="80" r="42" stroke="#f07d07" strokeWidth="0.8" strokeDasharray="2 4" opacity="0.4" className="spin-rev"/>
            {[0,45,90,135,180,225,270,315].map((deg, i) => {
              const rad = (deg * Math.PI) / 180;
              return <circle key={i} cx={80 + 58 * Math.sin(rad)} cy={80 - 58 * Math.cos(rad)} r="2.5" fill="#f07d07" opacity={i % 2 === 0 ? "0.7" : "0.35"}/>;
            })}
            {[0,60,120,180,240,300].map((deg, i) => {
              const rad = (deg * Math.PI) / 180;
              return <circle key={i} cx={80 + 42 * Math.sin(rad)} cy={80 - 42 * Math.cos(rad)} r="1.8" fill="#b38c0e" opacity="0.5"/>;
            })}
            <circle cx="80" cy="80" r="16" fill="#fff8ed" stroke="#ffd9a0" strokeWidth="1"/>
            <path d="M80 68 C80 68 74 74 74 80 C74 86 76 90 80 92 C84 90 86 86 86 80 C86 74 80 68 80 68Z" fill="#f07d07" opacity="0.9"/>
            <circle cx="80" cy="80" r="5" fill="#fff8ed" stroke="#f07d07" strokeWidth="1"/>
          </svg>
        </div>

        <div className="login-brand">
          <span className="login-brand-text">Guru</span>
          <span className="login-brand-accent">AI</span>
        </div>
        <p className="login-tagline">"Where every question<br/>meets its answer."</p>
        <div className="login-dots">
          <span className="login-dot login-dot-active"/>
          <span className="login-dot"/>
          <span className="login-dot"/>
        </div>
        <div className="login-pills">
          <span className="badge badge-primary">✦ Wise</span>
          <span className="badge badge-primary">✦ Instant</span>
          <span className="badge badge-primary">✦ Personal</span>
        </div>
      </div>
    </>
  );
}
