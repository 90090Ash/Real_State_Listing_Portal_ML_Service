import React from 'react';
import { darkGlassStyle, neonBtnStyle } from '../styles/theme';

function ChatDrawer({
  chatProperty,
  messages,
  newMessage,
  setNewMessage,
  handleSendMessage,
  onClose,
  user,
  chatBottomRef
}) {
  if (!chatProperty) return null;

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', width: '360px', height: '480px', ...darkGlassStyle, display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 9999 }}>
      <div style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <strong style={{ fontSize: '14px', fontFamily: "'Orbitron', sans-serif" }}>NEURAL CHAT LINK</strong>
          <span style={{ fontSize: '11px', display: 'block', opacity: 0.9 }}>{chatProperty.title}</span>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '18px', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
      </div>

      <div style={{ flex: 1, padding: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ alignSelf: msg.sender.includes('Buyer') || msg.sender === user?.name ? 'flex-end' : 'flex-start', maxWidth: '82%' }}>
            <div style={{
              padding: '8px 12px',
              borderRadius: '10px',
              fontSize: '13px',
              background: msg.sender.includes('Buyer') || msg.sender === user?.name ? '#3b82f6' : 'rgba(30, 41, 59, 0.9)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              {msg.text}
            </div>
            <span style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px', display: 'block', textAlign: 'right' }}>{msg.sender} • {msg.time}</span>
          </div>
        ))}
        <div ref={chatBottomRef} />
      </div>

      <form onSubmit={handleSendMessage} style={{ padding: '10px', borderTop: '1px solid rgba(56,189,248,0.2)', display: 'flex', gap: '8px' }}>
        <input
          type="text"
          placeholder="Transmit inquiry..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          style={{ flex: 1, padding: '8px 12px', background: '#020617', border: '1px solid rgba(56,189,248,0.3)', borderRadius: '20px', color: '#fff', outline: 'none' }}
        />
        <button type="submit" style={neonBtnStyle}>SEND</button>
      </form>
    </div>
  );
}

export default ChatDrawer;
