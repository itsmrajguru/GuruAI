import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  sendMessage,
  getConversations,
  getConversation,
  deleteConversation
} from '../api';
import TypingIndicator from '../components/TypingIndicator';

/* this helper function will take the standard date
  and format it to show hours and minutes nicely in the chats */
function formatTime(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/* this function is used to decide if the chat is from today
  yesterday, or older, so it can group them in the sidebar */
function formatSidebarDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

/* this function groups all the user's past chats into
  sections like Today, Yesterday and Earlier based on date */
function groupConversations(convs) {
  const today = [], yesterday = [], older = [];
  const now = new Date();
  convs.forEach(c => {
    const d = Math.floor((now - new Date(c.updatedAt)) / (1000 * 60 * 60 * 24));
    if (d === 0) today.push(c);
    else if (d === 1) yesterday.push(c);
    else older.push(c);
  });
  return { today, yesterday, older };
}

/* these are the default suggestions shown to the user
  when they open a new blank chat with GuruAI */
const SUGGESTIONS = [
  { icon: '📄', text: 'Review my resume' },
  { icon: '🎯', text: 'Prepare for interviews' },
  { icon: '🔄', text: 'Plan a career switch' },
  { icon: '💰', text: 'Negotiate my salary' },
  { icon: '🚀', text: 'Grow in my current role' },
  { icon: '🌐', text: 'Build my personal brand' },
];

/* here we keep all the styling information for our layout
  in dark theme, just like how the user wanted */
const S = {
  app: { display:'flex', height:'100vh', width:'100vw', background:'#0f0f10', fontFamily:"'Inter',system-ui,sans-serif", overflow:'hidden', color:'#e8e8e8', fontSize:'15px' },

  sidebar: (open) => ({ width: open ? '260px' : '0px', minWidth: open ? '260px' : '0px', height:'100vh', display:'flex', flexDirection:'column', background:'#161617', borderRight:'1px solid #222225', transition:'width 0.22s ease, min-width 0.22s ease', overflow:'hidden', flexShrink:0 }),
  sidebarTop: { padding:'16px 12px 12px', flexShrink:0 },
  logo: { display:'flex', alignItems:'center', gap:'10px', padding:'8px 10px', marginBottom:'10px' },
  logoIcon: { width:'30px', height:'30px', borderRadius:'8px', background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, overflow:'hidden' },
  logoText: { fontSize:'16px', fontWeight:600, color:'#f0f0f0', letterSpacing:'-0.4px' },
  newChatBtn: { width:'100%', display:'flex', alignItems:'center', gap:'9px', padding:'9px 12px', borderRadius:'8px', background:'transparent', border:'1px solid #2a2a2e', color:'#b8b8c0', cursor:'pointer', fontSize:'13.5px', fontFamily:"'Inter',sans-serif", fontWeight:500, transition:'background .15s,border-color .15s,color .15s', textAlign:'left' },
  convList: { flex:1, overflowY:'auto', padding:'4px 8px' },
  sectionLabel: { fontSize:'11px', fontWeight:500, color:'#52525a', padding:'14px 8px 4px', letterSpacing:'0.6px', textTransform:'uppercase', userSelect:'none' },
  convItem: (active) => ({ display:'flex', alignItems:'center', gap:'8px', padding:'7px 10px', borderRadius:'7px', cursor:'pointer', marginBottom:'1px', background: active ? '#252528' : 'transparent', transition:'background .12s' }),
  convTitle: (active) => ({ flex:1, fontSize:'13px', fontWeight: active ? 500 : 400, color: active ? '#e8e8e8' : '#9a9aa6', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', lineHeight:1.4 }),
  deleteBtn: { background:'none', border:'none', cursor:'pointer', padding:'3px', color:'#48484e', borderRadius:'4px', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'color .15s' },
  sidebarFooter: { padding:'10px 12px', borderTop:'1px solid #222225', display:'flex', alignItems:'center', gap:'10px', flexShrink:0 },
  userAvatar: { width:'28px', height:'28px', borderRadius:'50%', background:'#2a2a2e', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', fontWeight:600, color:'#88889a', flexShrink:0 },
  userEmail: { fontSize:'12px', color:'#62626e', flex:1, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' },
  logoutBtn: { background:'none', border:'none', cursor:'pointer', padding:'4px', color:'#48484e', display:'flex', borderRadius:'5px', transition:'color .15s' },

  main: { flex:1, display:'flex', flexDirection:'column', height:'100vh', overflow:'hidden', minWidth:0, position:'relative' },
  topbar: { display:'flex', alignItems:'center', gap:'10px', padding:'13px 20px', borderBottom:'1px solid #222225', flexShrink:0, background:'#0f0f10' },
  topbarToggle: { background:'none', border:'none', cursor:'pointer', padding:'6px', color:'#48484e', borderRadius:'7px', display:'flex', transition:'background .15s,color .15s' },
  topbarTitle: { flex:1, fontSize:'14px', fontWeight:500, color:'#b0b0bc', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' },

  messages: { flex:1, overflowY:'auto', padding:0 },
  messagesInner: { maxWidth:'720px', margin:'0 auto', padding:'32px 20px 130px' },

  /* Empty / welcome state */
  emptyWrap: { display:'flex', flexDirection:'column', alignItems:'center', padding:'80px 20px 32px' },
  emptyLogoWrap: { width:'44px', height:'44px', borderRadius:'12px', background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'24px', overflow:'hidden' },
  emptyTitle: { fontSize:'28px', fontWeight:600, color:'#e8e8e8', marginBottom:'10px', textAlign:'center', letterSpacing:'-0.6px', lineHeight:1.2 },
  emptySub: { fontSize:'15px', color:'#52525a', textAlign:'center', lineHeight:1.75, maxWidth:'420px', marginBottom:'36px' },
  suggestGrid: { display:'grid', gap:'8px', width:'100%', maxWidth:'520px' },
  chip: { display:'flex', alignItems:'center', gap:'12px', padding:'13px 16px', borderRadius:'10px', background:'#191919', border:'1px solid #272729', cursor:'pointer', textAlign:'left', transition:'background .15s,border-color .15s' },
  chipIcon: { fontSize:'17px', flexShrink:0 },
  chipText: { fontSize:'13.5px', color:'#a8a8b4', lineHeight:1.35, fontWeight:450 },

  /* Message rows — Claude style: no bubble for AI, pill for user */
  msgRow: (isUser) => ({ display:'flex', gap:'0', marginBottom: isUser ? '8px' : '0', alignItems:'flex-start' }),
  /* AI message — no bubble, just clean text in a row with avatar */
  aiRow: { display:'flex', gap:'16px', alignItems:'flex-start', padding:'18px 0', borderBottom:'none' },
  aiAvatar: { width:'26px', height:'26px', borderRadius:'6px', background:'#fff', flexShrink:0, marginTop:'1px', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center' },
  aiText: { flex:1, fontSize:'15.5px', lineHeight:1.85, color:'#d8d8e0', whiteSpace:'pre-wrap', wordBreak:'break-word', paddingTop:'2px' },
  aiTime: { fontSize:'10px', color:'#38383e', marginTop:'10px' },
  /* User message — subtle right-aligned pill */
  userRow: { display:'flex', justifyContent:'flex-end', padding:'4px 0 16px' },
  userBubble: { maxWidth:'75%', padding:'10px 16px', borderRadius:'18px 18px 4px 18px', fontSize:'15px', lineHeight:1.75, whiteSpace:'pre-wrap', wordBreak:'break-word', background:'#1e1e24', border:'1px solid #2c2c34', color:'#c8c8d8' },
  userTime: { fontSize:'10px', color:'#38383e', marginTop:'5px', textAlign:'right' },

  inputArea: { position:'absolute', bottom:0, left:0, right:0, padding:'0 20px 1px', background:'linear-gradient(to top, #0f0f10 65%, transparent)', pointerEvents:'none' },
  inputWrap: { maxWidth:'720px', margin:'0 auto', pointerEvents:'all' },
  inputBox: { display:'flex', alignItems:'flex-end', gap:'10px', background:'#1a1a1d', border:'1px solid #2a2a2e', borderRadius:'16px', padding:'14px 16px', boxShadow:'0 0 0 1px rgba(255,255,255,0.025), 0 12px 40px rgba(0,0,0,0.5)', transition:'border-color .2s' },
  inputTextarea: { flex:1, resize:'none', border:'none', outline:'none', background:'transparent', fontFamily:"'Inter',sans-serif", fontSize:'15px', color:'#d8d8e0', lineHeight:1.6, minHeight:'24px', maxHeight:'200px', overflowY:'auto' },
  sendBtn: (active) => ({ width:'34px', height:'34px', borderRadius:'8px', background: active ? '#f59e0b' : '#252528', border:'none', display:'flex', alignItems:'center', justifyContent:'center', cursor: active ? 'pointer' : 'default', flexShrink:0, opacity: active ? 1 : 0.45, transition:'background .15s,opacity .15s' }),
  inputHint: { textAlign:'center', fontSize:'11px', color:'#2a2a32', marginTop:'9px', letterSpacing:'0.2px' },
};

/* this is the main dashboard component which acts
  as the entire chat interface for the user */
export default function DashboardPage() {
  const navigate = useNavigate();

  // sidebar state
  const [conversations, setConversations] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const [deletingId, setDeletingId] = useState(null);

  // chat state
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  // user info
  const [userEmail, setUserEmail] = useState('');

  // refs
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  /* when the page loads, this hook will get the user info
    from local storage and load the past chats in the sidebar */
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try { setUserEmail(JSON.parse(stored).email || ''); } catch (_) {}
    }
    loadConversations();
  }, []);

  /* this hook automatically scrolls down the messages area
    so the latest message is always visible to the user */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  /* this will adjust the height of the typing box
    automatically when the user types long paragraphs */
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [input]);

  /* this function gets triggered to fetch all the past
    chat sessions from the database to show in sidebar */
  async function loadConversations() {
    try {
      const data = await getConversations();
      if (data.success) setConversations(data.conversations);
    } catch (e) { console.error('Failed to load conversations:', e); }
  }

  /* when the user clicks on any specific past chat in the sidebar,
    this will load its messages in the main screen */
  async function handleSelectConversation(id) {
    if (id === activeConversationId) return;
    try {
      const data = await getConversation(id);
      if (data.success) { setActiveConversationId(id); setMessages(data.conversation.messages); }
    } catch (e) { console.error('Failed to load conversation:', e); }
    /* on mobile, close the sidebar after selecting a chat */
    if (window.innerWidth < 768) setSidebarOpen(false);
  }

  /* this will clear the current chat window and let the user
    start a fresh new conversation with the AI */
  function handleNewChat() {
    setActiveConversationId(null);
    setMessages([]);
    setInput('');
    textareaRef.current?.focus();
    /* on mobile, close the sidebar after starting a new chat */
    if (window.innerWidth < 768) setSidebarOpen(false);
  }

  /* this function will completely remove a specific chat
    from both the sidebar and the database */
  async function handleDelete(e, id) {
    e.stopPropagation();
    setDeletingId(id);
    try {
      await deleteConversation(id);
      setConversations(prev => prev.filter(c => c._id !== id));
      if (activeConversationId === id) handleNewChat();
    } catch (e) { console.error('Failed to delete:', e); }
    finally { setDeletingId(null); }
  }

  /* this is the main logic which takes the user's text,
    shows it on screen and then sends it to our backend AI */
  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || isThinking) return;

    /* step 1 : optimistically add user message to the chat */
    const userMsg = { role: 'user', content: trimmed, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    try {
      /* step 2 : call the API */
      const data = await sendMessage(trimmed, activeConversationId);

      if (data.success) {
        /* step 3 : append AI reply */
        setMessages(prev => [...prev, { role: 'model', content: data.reply, timestamp: new Date().toISOString() }]);
        if (!activeConversationId) {
          setActiveConversationId(data.conversationId);
          loadConversations();
        } else {
          setConversations(prev => prev.map(c =>
            c._id === data.conversationId ? { ...c, updatedAt: new Date().toISOString() } : c
          ));
        }
      } else {
        setMessages(prev => [...prev, { role: 'model', content: '⚠️ ' + (data.message || 'Something went wrong.'), timestamp: new Date().toISOString() }]);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Connection error. Please check your network.';
      setMessages(prev => [...prev, { role: 'model', content: '⚠️ ' + errorMsg, timestamp: new Date().toISOString() }]);
    } finally { setIsThinking(false); }
  }

  /* this lets the user press enter key to send the message quickly
    without clicking the send button every time */
  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  }

  /* this will log out the user by clearing their local
    storage data and pushing them back to the login page */
  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }

  /* when the user clicks on any suggested topic chip, this
    will put that text in the input box so they can just send it */
  function handleSuggestion(text) { setInput(text); textareaRef.current?.focus(); }

  const grouped = groupConversations(conversations);
  const activeTitle = activeConversationId
    ? (conversations.find(c => c._id === activeConversationId)?.title || 'Conversation')
    : 'New conversation';

  /* this component creates the grouped sections in the
    sidebar like Today, Yesterday etc. for organizing chats */
  const ConvGroup = ({ label, items }) => items.length === 0 ? null : (
    <>
      <div style={S.sectionLabel}>{label}</div>
      {items.map(conv => (
        <div
          key={conv._id}
          onClick={() => handleSelectConversation(conv._id)}
          style={S.convItem(activeConversationId === conv._id)}
          onMouseEnter={e => { if (activeConversationId !== conv._id) e.currentTarget.style.background = '#232326'; }}
          onMouseLeave={e => { if (activeConversationId !== conv._id) e.currentTarget.style.background = 'transparent'; }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#525258" strokeWidth="1.8" strokeLinecap="round" style={{flexShrink:0}}>
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
          </svg>
          <div style={S.convTitle(activeConversationId === conv._id)}>{conv.title}</div>
          <button
            onClick={e => handleDelete(e, conv._id)}
            disabled={deletingId === conv._id}
            style={{...S.deleteBtn, opacity: deletingId === conv._id ? 0.4 : undefined}}
            onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.opacity = '1'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#525258'; e.currentTarget.style.opacity = ''; }}
            title="Delete"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
              <path d="M10 11v6M14 11v6"/>
            </svg>
          </button>
        </div>
      ))}
    </>
  );

  return (
    <div style={S.app}>
      {/* Global keyframes + scrollbar styling */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,400;0,14..32,500;0,14..32,600;1,14..32,400&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
        .msg-anim { animation: fadeUp .2s ease; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2e2e32; border-radius: 4px; }

        /* Mobile sidebar — full screen drawer like ChatGPT/Claude mobile */
        @media (max-width: 767px) {
          .guru-sidebar {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            height: 100vh !important;
            width: 100vw !important;
            min-width: 100vw !important;
            z-index: 1000;
            transform: translateX(-100%);
            transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1) !important;
          }
          .guru-sidebar.open {
            transform: translateX(0);
          }
          .guru-main {
            width: 100% !important;
            min-width: 0 !important;
            flex: 1 !important;
          }
          .guru-mobile-close {
            display: flex !important;
          }
        }
        @media (min-width: 768px) {
          .guru-sidebar {
            position: relative !important;
            transform: none !important;
          }
          .guru-mobile-close {
            display: none !important;
          }
        }
        .guru-mobile-close {
          display: none;
          align-items: center;
          justify-content: center;
          margin-left: auto;
          background: none;
          border: none;
          cursor: pointer;
          color: #88889a;
          padding: 6px;
          border-radius: 7px;
          transition: background .15s, color .15s;
        }
        .guru-mobile-close:hover {
          background: #232326;
          color: #ececec;
        }
      `}</style>

      {/* ══════════════════════════════════════
          SIDEBAR
          ══════════════════════════════════════ */}
      <aside style={S.sidebar(sidebarOpen)} className={`guru-sidebar${sidebarOpen ? ' open' : ''}`}>
        <div style={S.sidebarTop}>

          {/* Logo row — the X button only shows on mobile to close the full-screen sidebar */}
          <div style={S.logo}>
            <div style={S.logoIcon}>
              <img src="/logo.svg" alt="GuruAI Logo" style={{ width:'100%', height:'100%', objectFit:'contain' }} />
            </div>
            <span style={S.logoText}>Guru<span style={{color:'#f59e0b'}}>AI</span></span>
            <button
              className="guru-mobile-close"
              onClick={() => setSidebarOpen(false)}
              title="Close sidebar"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* New Conversation button */}
          <button
            id="new-chat-btn"
            onClick={handleNewChat}
            style={S.newChatBtn}
            onMouseEnter={e => { e.currentTarget.style.background='#232326'; e.currentTarget.style.borderColor='#3a3a3f'; e.currentTarget.style.color='#ececec'; }}
            onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='#2e2e32'; e.currentTarget.style.color='#c9c9cc'; }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            New conversation
          </button>
        </div>

        {/* Conversation list grouped by date */}
        <div style={S.convList}>
          {conversations.length === 0 ? (
            <div style={{padding:'24px 10px', textAlign:'center', color:'#525258', fontSize:'12px', lineHeight:1.7}}>
              No conversations yet.<br/>Start chatting with GuruAI!
            </div>
          ) : (
            <>
              <ConvGroup label="Today" items={grouped.today} />
              <ConvGroup label="Yesterday" items={grouped.yesterday} />
              <ConvGroup label="Earlier" items={grouped.older} />
            </>
          )}
        </div>

        {/* Sidebar footer — user info + logout */}
        <div style={S.sidebarFooter}>
          <div style={S.userAvatar}>{userEmail ? userEmail[0].toUpperCase() : 'U'}</div>
          <div style={S.userEmail}>{userEmail || 'User'}</div>
          <button
            id="logout-btn"
            onClick={handleLogout}
            title="Logout"
            style={S.logoutBtn}
            onMouseEnter={e => e.currentTarget.style.color='#ef4444'}
            onMouseLeave={e => e.currentTarget.style.color='#525258'}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </aside>

      {/* ══════════════════════════════════════
          MAIN CHAT AREA
          ══════════════════════════════════════ */}
      <main style={S.main} className="guru-main">

        {/* Top bar */}
        <header style={S.topbar}>
          <button
            id="sidebar-toggle-btn"
            onClick={() => setSidebarOpen(p => !p)}
            style={S.topbarToggle}
            title={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
            onMouseEnter={e => { e.currentTarget.style.background='#232326'; e.currentTarget.style.color='#9a9aa8'; }}
            onMouseLeave={e => { e.currentTarget.style.background='none'; e.currentTarget.style.color='#525258'; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <span style={S.topbarTitle}>{activeTitle}</span>
        </header>

        {/* Messages area — extra bottom padding leaves room for the floating input */}
        <div style={S.messages}>
          <div style={S.messagesInner}>

            {/* Empty / Welcome state */}
            {messages.length === 0 && (
              <div style={S.emptyWrap}>
                <div style={S.emptyLogoWrap}>
                  <img src="/logo.svg" alt="GuruAI Logo" style={{ width:'100%', height:'100%', objectFit:'contain' }} />
                </div>
                <h2 style={S.emptyTitle}>
                  Namaste! I'm <span style={{color:'#f59e0b'}}>GuruAI</span>
                </h2>
                <p style={S.emptySub}>
                  Your personal career guidance companion. Ask me anything about your career — resume tips, interview prep, salary negotiation, and beyond.
                </p>
                <div style={S.suggestGrid} className="grid-cols-1 md:grid-cols-2">
                  {SUGGESTIONS.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestion(s.text)}
                      style={S.chip}
                      onMouseEnter={e => { e.currentTarget.style.background='#232326'; e.currentTarget.style.borderColor='#3a3a3f'; }}
                      onMouseLeave={e => { e.currentTarget.style.background='#1c1c1f'; e.currentTarget.style.borderColor='#2e2e32'; }}
                    >
                      <span style={S.chipIcon}>{s.icon}</span>
                      <span style={S.chipText}>{s.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message rows — Claude style */}
            {messages.map((msg, idx) => {
              const isUser = msg.role === 'user';
              if (isUser) {
                return (
                  <div key={idx} style={S.userRow} className="msg-anim">
                    <div>
                      <div style={S.userBubble}>{msg.content}</div>
                      <div style={S.userTime}>{formatTime(msg.timestamp)}</div>
                    </div>
                  </div>
                );
              }
              return (
                <div key={idx} style={S.aiRow} className="msg-anim">
                  {/* GuruAI logo avatar */}
                  <div style={S.aiAvatar}>
                    <img src="/logo.svg" alt="GuruAI" style={{ width:'100%', height:'100%', objectFit:'contain' }} />
                  </div>
                  {/* Plain text — no bubble, just like Claude */}
                  <div style={S.aiText}>
                    {msg.content}
                    <div style={S.aiTime}>{formatTime(msg.timestamp)}</div>
                  </div>
                </div>
              );
            })}

            {/* Typing indicator shown while AI is generating */}
            {isThinking && <TypingIndicator />}

            {/* Invisible scroll anchor */}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input bar */}
        <div style={S.inputArea}>
          <div style={S.inputWrap}>
            <div
              style={S.inputBox}
              onFocusCapture={e => e.currentTarget.style.borderColor='#3a3a3f'}
              onBlurCapture={e => e.currentTarget.style.borderColor='#2e2e32'}
            >
              <textarea
                id="chat-input"
                ref={textareaRef}
                rows={1}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask GuruAI anything about your career…"
                disabled={isThinking}
                style={S.inputTextarea}
              />
              <button
                id="send-btn"
                onClick={handleSend}
                disabled={!input.trim() || isThinking}
                style={S.sendBtn(!!input.trim() && !isThinking)}
                title="Send message (Enter)"
              >
                {isThinking
                  ? <span style={{width:'13px', height:'13px', border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', borderRadius:'50%', display:'inline-block', animation:'spin .7s linear infinite'}} />
                  : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13"/>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                }
              </button>
            </div>
            <p style={S.inputHint}>Enter to send · Shift+Enter for new line</p>
          </div>
        </div>
      </main>
    </div>
  );
}