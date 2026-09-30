import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';


const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const socket = io('API_URL');

function AgentDashboard({ onBack }) {
  const [messages, setMessages] = useState([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [replyText, setReplyText] = useState('');

  const fetchMessages = async () => {
    try {
      const res = await axios.get(API_URL + '/api/agent/messages');
      setMessages(res.data);
      if (res.data.length > 0 && !selectedPropertyId) {
        setSelectedPropertyId(res.data[0].property_id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMessages();

    socket.on('receive_message', () => {
      fetchMessages();
    });

    return () => socket.off('receive_message');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSendAgentReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedPropertyId) return;

    socket.emit('send_message', {
      propertyId: selectedPropertyId,
      sender: 'Agent (Live)',
      text: replyText
    });

    setReplyText('');
  };

  // Group messages by property
  const groupedProperties = messages.reduce((acc, msg) => {
    if (!acc[msg.property_id]) {
      acc[msg.property_id] = { title: msg.property_title, messages: [] };
    }
    acc[msg.property_id].messages.push(msg);
    return acc;
  }, {});

  const activeGroup = groupedProperties[selectedPropertyId];

  return (
    <div style={{ padding: '24px', fontFamily: 'Segoe UI, sans-serif', maxWidth: '1100px', margin: '0 auto' }}>
      <button onClick={onBack} style={{ marginBottom: '20px', padding: '8px 16px', borderRadius: '4px', border: 'none', backgroundColor: '#6c757d', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>
        ← Back to Buyer Portal
      </button>

      <h2>🏢 Agent Real-Time Lead Desk</h2>

      <div style={{ display: 'flex', gap: '20px', minHeight: '500px', border: '1px solid #ddd', borderRadius: '12px', overflow: 'hidden' }}>
        {/* Left Sidebar: Property Conversations */}
        <div style={{ width: '320px', borderRight: '1px solid #ddd', backgroundColor: '#f8f9fa' }}>
          <div style={{ padding: '16px', fontWeight: 'bold', borderBottom: '1px solid #ddd', backgroundColor: '#e9ecef' }}>
            Active Property Inquiries
          </div>
          {Object.keys(groupedProperties).map((propId) => (
            <div
              key={propId}
              onClick={() => {
                setSelectedPropertyId(Number(propId));
                socket.emit('join_property_chat', Number(propId));
              }}
              style={{
                padding: '14px',
                borderBottom: '1px solid #eee',
                cursor: 'pointer',
                backgroundColor: Number(propId) === selectedPropertyId ? '#e7f1ff' : '#fff',
                fontWeight: Number(propId) === selectedPropertyId ? 'bold' : 'normal'
              }}
            >
              <div>{groupedProperties[propId].title}</div>
              <span style={{ fontSize: '12px', color: '#666' }}>
                {groupedProperties[propId].messages.length} messages
              </span>
            </div>
          ))}
        </div>

        {/* Right Pane: Conversation Thread */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#fff' }}>
          {activeGroup ? (
            <>
              <div style={{ padding: '16px', borderBottom: '1px solid #ddd', backgroundColor: '#0d6efd', color: '#fff', fontWeight: 'bold' }}>
                Chatting for: {activeGroup.title}
              </div>

              <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column-reverse', gap: '10px' }}>
                {activeGroup.messages.map((m) => (
                  <div key={m.id} style={{ alignSelf: m.sender.includes('Agent') ? 'flex-end' : 'flex-start', maxWidth: '75%' }}>
                    <div style={{ fontSize: '11px', color: '#666', marginBottom: '2px' }}>{m.sender} • {m.time}</div>
                    <div style={{ padding: '10px 14px', borderRadius: '10px', backgroundColor: m.sender.includes('Agent') ? '#0d6efd' : '#f1f3f5', color: m.sender.includes('Agent') ? '#fff' : '#212529' }}>
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendAgentReply} style={{ padding: '16px', borderTop: '1px solid #ddd', display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="Type reply as agent..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                />
                <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Reply
                </button>
              </form>
            </>
          ) : (
            <div style={{ padding: '40px', color: '#888', textAlign: 'center' }}>Select a conversation from the left to start replying.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AgentDashboard;
