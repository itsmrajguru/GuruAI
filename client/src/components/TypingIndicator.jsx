/* this animated component shows three bouncing dots
  to tell the user that the GuruAI is currently thinking and generating a reply */

export default function TypingIndicator() {
  return (
    <div style={{ display:'flex', gap:'16px', alignItems:'flex-start', padding:'18px 0' }}>
      /* here we show the GuruAI logo right next to the typing dots */
      <div style={{ width:'26px', height:'26px', borderRadius:'6px', background:'#fff', flexShrink:0, marginTop:'1px', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <img src="/logo.svg" alt="GuruAI" style={{ width:'100%', height:'100%', objectFit:'contain' }} />
      </div>

      /* this container holds the three dots which will animate
        one by one to create a nice bouncing effect */
      <div style={{ flex:1, display:'flex', gap:'5px', alignItems:'center', height:'24px' }}>
        {[0, 200, 400].map(delay => (
          <span
            key={delay}
            style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#666', display:'inline-block', animation:'typingBounce 1.2s ease-in-out infinite', animationDelay:`${delay}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
