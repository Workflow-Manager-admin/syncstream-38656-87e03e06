import React from 'react';
import './App.css';

// PUBLIC_INTERFACE
function SyncStreamNavbar({ onCreateRoom, onInvite }) {
  /** SyncStream app navigation bar with room actions. */
  return (
    <nav className="ss-navbar" style={{ background: 'var(--primary)' }}>
      <div className="ss-navbar-content">
        <div className="ss-logo">
          <span className="ss-logo-symbol" style={{ color: 'var(--accent)' }}>⏯️</span>
          SyncStream
        </div>
        <div className="ss-room-actions">
          <button className="ss-btn ss-btn-secondary" onClick={onCreateRoom}>Create Room</button>
          <button className="ss-btn ss-btn-accent" onClick={onInvite}>Invite</button>
        </div>
      </div>
    </nav>
  );
}

// PUBLIC_INTERFACE
function VideoPlayer() {
  /** Central video player with controls (placeholder). */
  return (
    <div className="ss-video-player">
      <video className="ss-video" controls poster="" width="100%">
        <source src="" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {/* Playback controls would go here for real implementation */}
    </div>
  );
}

// PUBLIC_INTERFACE
function GroupChatPanel() {
  /** Sidebar or bottom group chat panel (UI only, no backend). */
  // Mock messages for appearance
  const messages = [
    { user: 'Alice', text: 'Ready to start!' },
    { user: 'Bob', text: 'Hit play!' },
    { user: 'You', text: 'Let\'s go 🚀' }
  ];
  return (
    <div className="ss-chat-panel">
      <div className="ss-chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className="ss-chat-msg">
            <span className="ss-chat-user">{msg.user}:</span> <span>{msg.text}</span>
          </div>
        ))}
      </div>
      <div className="ss-chat-input-row">
        <input className="ss-chat-input" placeholder="Type a message..." />
        <button className="ss-btn ss-btn-accent ss-chat-send">Send</button>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function SyncStreamHome() {
  // Room management handlers (placeholders)
  const handleCreateRoom = () => alert('Create Room feature coming soon!');
  const handleInvite = () => alert('Invite feature coming soon!');

  return (
    <div className="ss-app">
      <SyncStreamNavbar onCreateRoom={handleCreateRoom} onInvite={handleInvite} />
      <main className="ss-main-area">
        <div className="ss-main-panel">
          <VideoPlayer />
          <div className="ss-room-id-note">
            Room: <span className="ss-room-id">#ABC123</span>
          </div>
        </div>
        <GroupChatPanel />
      </main>
    </div>
  );
}

export default SyncStreamHome;
