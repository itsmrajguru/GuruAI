import logo from "../assets/logo.svg";

export default function AuthLeftPanel() {
  return (
    <>
      {/* Dynamic Background Accents */}
      <div className="absolute rounded-full pointer-events-none z-0 w-[600px] h-[600px] -top-[200px] -left-[180px] bg-[radial-gradient(circle,rgba(255,210,130,0.35)_0%,transparent_70%)] animate-pulse-slow" />
      <div className="absolute rounded-full pointer-events-none z-0 w-[500px] h-[500px] -bottom-[150px] -right-[120px] bg-[radial-gradient(circle,rgba(240,125,7,0.15)_0%,transparent_70%)] animate-pulse-slow delay-700" />
      
      {/* Content Container */}
      <div className="flex flex-col items-start flex-none w-[320px] relative z-10 animate-fade-up">
        
        {/* Brand Logo for the GuruAI Project */}
        <div className="mb-6 w-full flex justify-center">
          <img src={logo} alt="GuruAI Logo" className="h-24 w-auto" />
        </div>

        {/* Hero Typography Segment */}
        <div className="mb-4">
          <h1 className="font-display text-[2.75rem] leading-[1.1] font-semibold text-neutral-900 mb-4 -tracking-[0.03em]">
            Unlock Your <span className="text-primary-500 italic block mt-1">Career Potential</span>
          </h1>
          <p className="font-body text-[0.9375rem] leading-relaxed text-surface-800 max-w-[280px]">
            GuruAI combines <span className="font-semibold text-neutral-900">ancient guidance</span> with <span className="font-semibold text-neutral-900">modern intelligence</span> to navigate your path.
          </p>
        </div>

        {/* Contextual Stats / Social Proof */}
        <div className="mt-4 border-l-[1.5px] border-primary-500/30 pl-5 py-1">
          <div className="flex flex-col gap-1">
            <span className="text-[1.25rem] font-display font-bold text-neutral-900">50K+</span>
            <span className="text-[0.7rem] font-bold uppercase tracking-widest text-surface-600">Professionals Guided</span>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex gap-[8px] mt-4">
          <span className="w-8 h-[2px] rounded-full bg-primary-500"/>
          <span className="w-4 h-[2px] rounded-full bg-surface-500/40"/>
          <span className="w-4 h-[2px] rounded-full bg-surface-500/40"/>
        </div>
      </div>
    </>
  );
}
