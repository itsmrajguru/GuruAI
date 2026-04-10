import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  sendMessage,
  getConversations,
  getConversation,
  deleteConversation
} from '../api';
import TypingIndicator from '../components/TypingIndicator';

// ─────────────────────────────────────────────────────────────────
// Helper: Format a UTC timestamp into a readable time string
// ─────────────────────────────────────────────────────────────────
function formatTime(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ─────────────────────────────────────────────────────────────────
// Helper: Format date for sidebar conversation list
// ─────────────────────────────────────────────────────────────────
function formatSidebarDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now - d;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

// ─────────────────────────────────────────────────────────────────
// Suggestion chips — shown on empty/new chat to guide the user
// ─────────────────────────────────────────────────────────────────
const SUGGESTIONS = [
  { icon: '📄', text: 'Review my resume' },
  { icon: '🎯', text: 'Prepare for interviews' },
  { icon: '🔄', text: 'Plan a career switch' },
  { icon: '💰', text: 'Negotiate my salary' },
  { icon: '🚀', text: 'Grow in my current role' },
  { icon: '🌐', text: 'Build my personal brand' },
];

// ─────────────────────────────────────────────────────────────────
// DashboardPage — the main AI chat interface
// ─────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const navigate = useNavigate();

  // sidebar state
  const [conversations, setConversations] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [deletingId, setDeletingId] = useState(null); // id of conv being deleted

  // chat state
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  // user info
  const [userEmail, setUserEmail] = useState('');

  // refs
  const messagesEndRef = useRef(null);       // scroll anchor at bottom of chat
  const textareaRef = useRef(null);          // input textarea

  // ─── On mount: load user info + sidebar conversations ───────────
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try { setUserEmail(JSON.parse(stored).email || ''); } catch (_) {}
    }
    loadConversations();
  }, []);

  // ─── Auto-scroll to bottom whenever messages change ─────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // ─── Auto-resize textarea as user types ─────────────────────────
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [input]);

  // ─── Load all conversations for sidebar ─────────────────────────
  async function loadConversations() {
    try {
      const data = await getConversations();
      if (data.success) setConversations(data.conversations);
    } catch (e) {
      console.error('Failed to load conversations:', e);
    }
  }

  // ─── Click a conversation in the sidebar ────────────────────────
  async function handleSelectConversation(id) {
    if (id === activeConversationId) return;
    try {
      const data = await getConversation(id);
      if (data.success) {
        setActiveConversationId(id);
        setMessages(data.conversation.messages);
      }
    } catch (e) {
      console.error('Failed to load conversation:', e);
    }
  }

  // ─── Start a fresh new chat ──────────────────────────────────────
  function handleNewChat() {
    setActiveConversationId(null);
    setMessages([]);
    setInput('');
    textareaRef.current?.focus();
  }

  // ─── Delete a conversation ───────────────────────────────────────
  async function handleDelete(e, id) {
    e.stopPropagation(); // prevent selecting the conversation
    setDeletingId(id);
    try {
      await deleteConversation(id);
      setConversations(prev => prev.filter(c => c._id !== id));
      // if the deleted conv was active, reset to new chat
      if (activeConversationId === id) handleNewChat();
    } catch (e) {
      console.error('Failed to delete:', e);
    } finally {
      setDeletingId(null);
    }
  }

  // ─── Send a message (main interaction) ──────────────────────────
  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || isThinking) return;

    // optimistically add user message to the chat
    const userMsg = { role: 'user', content: trimmed, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    try {
      const data = await sendMessage(trimmed, activeConversationId);

      if (data.success) {
        // add AI reply to the chat
        const aiMsg = { role: 'model', content: data.reply, timestamp: new Date().toISOString() };
        setMessages(prev => [...prev, aiMsg]);

        // if this was a new conversation, set the active ID and refresh sidebar
        if (!activeConversationId) {
          setActiveConversationId(data.conversationId);
          loadConversations();
        } else {
          // update the updatedAt in sidebar without a full reload
          setConversations(prev =>
            prev.map(c =>
              c._id === data.conversationId
                ? { ...c, updatedAt: new Date().toISOString() }
                : c
            )
          );
        }
      } else {
        setMessages(prev => [...prev, {
          role: 'model',
          content: '⚠️ ' + (data.message || 'Something went wrong. Please try again.'),
          timestamp: new Date().toISOString()
        }]);
      }
    } catch (err) {
      console.error('sendMessage error:', err);
      // If the backend sent a specific error message (like "Rate limit reached"), show it
      const errorMsg = err.response?.data?.message || 'Connection error. Please check your network and try again.';
      setMessages(prev => [...prev, {
        role: 'model',
        content: '⚠️ ' + errorMsg,
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsThinking(false);
    }
  }

  // ─── Keyboard: Enter sends, Shift+Enter is a newline ────────────
  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  // ─── Logout ──────────────────────────────────────────────────────
  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }

  // ─── Suggestion chip clicked → fill input ────────────────────────
  function handleSuggestion(text) {
    setInput(text);
    textareaRef.current?.focus();
  }

  // ─────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────
  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      background: 'var(--color-bg)',
      fontFamily: 'var(--font-body)',
      overflow: 'hidden'
    }}>

      {/* ═══════════════════════════════════════════════════════════
          SIDEBAR
          ═══════════════════════════════════════════════════════════ */}
      <aside style={{
        width: sidebarOpen ? '280px' : '0px',
        minWidth: sidebarOpen ? '280px' : '0px',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: '#fff',
        borderRight: '1px solid var(--color-border)',
        transition: 'width 0.25s var(--ease-smooth), min-width 0.25s var(--ease-smooth)',
        overflow: 'hidden',
        flexShrink: 0
      }}>

        {/* Sidebar Header */}
        <div style={{
          padding: '20px 16px 12px',
          borderBottom: '1px solid var(--color-border)',
          flexShrink: 0
        }}>
          {/* Logo */}
          <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: 'var(--gradient-saffron)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0
            }}>
              <span style={{ color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem' }}>G</span>
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.2rem', color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>
              Guru<span style={{ color: 'var(--color-primary)' }}>AI</span>
            </span>
          </div>

          {/* New Chat Button */}
          <button
            id="new-chat-btn"
            onClick={handleNewChat}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
              background: 'var(--gradient-saffron)', color: '#fff', border: 'none',
              borderRadius: '10px', padding: '9px 14px', cursor: 'pointer',
              fontSize: '0.8rem', fontWeight: 600, fontFamily: 'var(--font-body)',
              boxShadow: 'var(--shadow-btn)',
              transition: 'opacity 0.2s, transform 0.15s var(--ease-spring)'
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1v12M1 7h12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            New Conversation
          </button>
        </div>

        {/* Conversation List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 8px' }}>
          {conversations.length === 0 ? (
            <div style={{ padding: '24px 12px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
              No conversations yet.<br />Start chatting with GuruAI!
            </div>
          ) : (
            conversations.map(conv => (
              <div
                key={conv._id}
                onClick={() => handleSelectConversation(conv._id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '9px 10px', borderRadius: '8px', cursor: 'pointer',
                  marginBottom: '2px',
                  background: activeConversationId === conv._id ? 'rgba(240,125,7,0.08)' : 'transparent',
                  border: activeConversationId === conv._id ? '1px solid rgba(240,125,7,0.2)' : '1px solid transparent',
                  transition: 'background 0.15s, border 0.15s',
                  position: 'relative',
                  group: 'true'
                }}
                onMouseEnter={e => {
                  if (activeConversationId !== conv._id) e.currentTarget.style.background = 'rgba(0,0,0,0.03)';
                }}
                onMouseLeave={e => {
                  if (activeConversationId !== conv._id) e.currentTarget.style.background = 'transparent';
                }}
              >
                {/* Chat icon */}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={activeConversationId === conv._id ? 'var(--color-primary)' : 'var(--color-text-muted)'} strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                </svg>

                {/* Title + date */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '0.8rem', fontWeight: 500, color: 'var(--color-text-primary)',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    lineHeight: 1.3
                  }}>
                    {conv.title}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', marginTop: '1px' }}>
                    {formatSidebarDate(conv.updatedAt)}
                  </div>
                </div>

                {/* Delete button */}
                <button
                  onClick={(e) => handleDelete(e, conv._id)}
                  disabled={deletingId === conv._id}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer', padding: '2px',
                    color: 'var(--color-text-muted)', borderRadius: '4px', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: deletingId === conv._id ? 0.5 : 0.6,
                    transition: 'opacity 0.15s, color 0.15s'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#e53e3e'; e.currentTarget.style.opacity = '1'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.opacity = '0.6'; }}
                  title="Delete conversation"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                    <path d="M10 11v6M14 11v6"/>
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Sidebar Footer — user info + logout */}
        <div style={{
          padding: '12px 16px', borderTop: '1px solid var(--color-border)',
          display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0
        }}>
          <div style={{
            width: '30px', height: '30px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #f07d07, #c45e02)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            <span style={{ color: '#fff', fontSize: '0.7rem', fontWeight: 700 }}>
              {userEmail ? userEmail[0].toUpperCase() : 'U'}
            </span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {userEmail || 'User'}
            </div>
          </div>
          <button
            id="logout-btn"
            onClick={handleLogout}
            title="Logout"
            style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
              color: 'var(--color-text-muted)', borderRadius: '6px', display: 'flex',
              alignItems: 'center', transition: 'color 0.15s'
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#e53e3e'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </aside>

      {/* ═══════════════════════════════════════════════════════════
          MAIN CHAT AREA
          ═══════════════════════════════════════════════════════════ */}
      <main style={{
        flex: 1, display: 'flex', flexDirection: 'column', height: '100vh',
        overflow: 'hidden', position: 'relative', minWidth: 0
      }}>

        {/* Top Bar */}
        <header style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '14px 20px', borderBottom: '1px solid var(--color-border)',
          background: 'rgba(255,250,244,0.85)', backdropFilter: 'blur(12px)',
          flexShrink: 0
        }}>
          {/* Sidebar toggle */}
          <button
            id="sidebar-toggle-btn"
            onClick={() => setSidebarOpen(p => !p)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '6px', borderRadius: '8px', color: 'var(--color-text-muted)',
              display: 'flex', transition: 'background 0.15s, color 0.15s'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.05)'; e.currentTarget.style.color = 'var(--color-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--color-text-muted)'; }}
            title={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>

          <div style={{ flex: 1 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.05rem', color: 'var(--color-text-primary)', letterSpacing: '-0.01em' }}>
              {activeConversationId
                ? (conversations.find(c => c._id === activeConversationId)?.title || 'Conversation')
                : 'New Conversation'}
            </span>
          </div>

          {/* Status pill */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '4px 10px', borderRadius: '20px',
            background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)'
          }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', animation: 'pulse 2s infinite' }}/>
            <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#16a34a' }}>GuruAI Online</span>
          </div>
        </header>

        {/* ── Messages Area ─────────────────────────────────────── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>

          {/* Empty / Welcome state */}
          {messages.length === 0 && (
            <div style={{ maxWidth: '600px', margin: '0 auto', paddingTop: '40px' }}>
              {/* Hero */}
              <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                <div style={{
                  width: '64px', height: '64px', borderRadius: '18px',
                  background: 'var(--gradient-saffron)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px', boxShadow: 'var(--shadow-btn)'
                }}>
                  <span style={{ color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.75rem' }}>G</span>
                </div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.75rem', color: 'var(--color-text-primary)', marginBottom: '8px', lineHeight: 1.2 }}>
                  Namaste! I'm <span style={{ color: 'var(--color-primary)' }}>GuruAI</span>
                </h2>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.7, maxWidth: '400px', margin: '0 auto' }}>
                  Your personal career guidance companion. Ask me anything about your career — from resume tips to interview prep, salary negotiation, and beyond.
                </p>
              </div>

              {/* Suggestion chips */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestion(s.text)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '13px 16px', borderRadius: '12px',
                      background: '#fff', border: '1.5px solid var(--color-border)',
                      cursor: 'pointer', textAlign: 'left',
                      transition: 'border-color 0.2s, transform 0.15s, box-shadow 0.2s',
                      boxShadow: 'var(--shadow-card)'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'var(--color-primary)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'var(--color-border)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-card)';
                    }}
                  >
                    <span style={{ fontSize: '1.2rem' }}>{s.icon}</span>
                    <span style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--color-text-secondary)', lineHeight: 1.3 }}>{s.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message bubbles */}
          {messages.length > 0 && (
            <div style={{ maxWidth: '760px', margin: '0 auto' }}>
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                    alignItems: 'flex-start',
                    gap: '10px',
                    marginBottom: '16px',
                    animation: 'fadeIn 0.2s ease'
                  }}
                >
                  {/* Avatar */}
                  {msg.role === 'model' && (
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '50%',
                      background: 'var(--gradient-saffron)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, boxShadow: '0 2px 8px rgba(240,125,7,0.3)'
                    }}>
                      <span style={{ color: '#fff', fontSize: '0.7rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}>G</span>
                    </div>
                  )}

                  {/* Bubble */}
                  <div style={{
                    maxWidth: '75%',
                    padding: '12px 16px',
                    borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: msg.role === 'user'
                      ? 'linear-gradient(135deg, #1a1410, #2e2620)'
                      : '#fff',
                    color: msg.role === 'user' ? '#fff' : 'var(--color-text-primary)',
                    border: msg.role === 'user' ? 'none' : '1px solid var(--color-border)',
                    boxShadow: msg.role === 'user' ? '0 2px 12px rgba(26,20,16,0.2)' : 'var(--shadow-card)',
                    fontSize: '0.875rem',
                    lineHeight: 1.7,
                    /* Preserve whitespace / line breaks from Gemini's response */
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}>
                    {msg.content}
                    <div style={{
                      marginTop: '6px', fontSize: '0.65rem',
                      color: msg.role === 'user' ? 'rgba(255,255,255,0.5)' : 'var(--color-text-muted)',
                      textAlign: 'right'
                    }}>
                      {formatTime(msg.timestamp)}
                    </div>
                  </div>

                  {/* User avatar */}
                  {msg.role === 'user' && (
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #4a4540, #2e2620)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <span style={{ color: '#fff', fontSize: '0.7rem', fontWeight: 700 }}>
                        {userEmail ? userEmail[0].toUpperCase() : 'U'}
                      </span>
                    </div>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {isThinking && <TypingIndicator />}

              {/* Invisible scroll anchor */}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Scroll anchor for empty state */}
          {messages.length === 0 && <div ref={messagesEndRef} />}
        </div>

        {/* ── Input Bar ─────────────────────────────────────────── */}
        <div style={{
          padding: '12px 20px 16px',
          background: 'rgba(255,250,244,0.9)',
          backdropFilter: 'blur(12px)',
          borderTop: '1px solid var(--color-border)',
          flexShrink: 0
        }}>
          <div style={{
            maxWidth: '760px', margin: '0 auto',
            display: 'flex', alignItems: 'flex-end', gap: '10px',
            background: '#fff', border: '1.5px solid var(--color-border)',
            borderRadius: '16px', padding: '10px 12px',
            boxShadow: 'var(--shadow-card)',
            transition: 'border-color 0.2s, box-shadow 0.2s'
          }}
            onFocusCapture={e => {
              e.currentTarget.style.borderColor = 'var(--color-border-focus)';
              e.currentTarget.style.boxShadow = 'var(--shadow-glow-sm)';
            }}
            onBlurCapture={e => {
              e.currentTarget.style.borderColor = 'var(--color-border)';
              e.currentTarget.style.boxShadow = 'var(--shadow-card)';
            }}
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
              style={{
                flex: 1, resize: 'none', border: 'none', outline: 'none',
                background: 'transparent', fontFamily: 'var(--font-body)',
                fontSize: '0.9rem', color: 'var(--color-text-primary)',
                lineHeight: 1.6, minHeight: '24px', maxHeight: '160px',
                overflowY: 'auto'
              }}
            />
            <button
              id="send-btn"
              onClick={handleSend}
              disabled={!input.trim() || isThinking}
              className="btn-send"
              title="Send message (Enter)"
            >
              {isThinking ? (
                <span style={{
                  width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.4)',
                  borderTopColor: '#fff', borderRadius: '50%',
                  display: 'inline-block',
                  animation: 'spin 0.7s linear infinite'
                }}/>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              )}
            </button>
          </div>
          <p style={{ textAlign: 'center', fontSize: '0.65rem', color: 'var(--color-text-muted)', marginTop: '8px' }}>
            Press <kbd style={{ background: 'var(--color-border)', padding: '1px 5px', borderRadius: '4px', fontSize: '0.6rem' }}>Enter</kbd> to send · <kbd style={{ background: 'var(--color-border)', padding: '1px 5px', borderRadius: '4px', fontSize: '0.6rem' }}>Shift+Enter</kbd> for new line
          </p>
        </div>
      </main>

      {/* Global keyframe for send button spinner + message fade */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>
    </div>
  );
}