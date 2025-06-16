import React, { useState, useRef } from "react";
import "./SyncStreamApp.css";

/*
  PUBLIC_INTERFACE
  Main container for SyncStream: Contains video player, chat, and room management.
*/
function SyncStreamApp() {
  // Simulated state for demonstration (room and chat)
  const [roomId, setRoomId] = useState("ABCD1234");
  const [showInvite, setShowInvite] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { user: "Alex", text: "Hi everyone!" },
    { user: "Jamie", text: "Ready to watch?" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const videoRef = useRef(null);

  // PUBLIC_INTERFACE
  // Handles sending a chat message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (chatInput.trim()) {
      setChatMessages([...chatMessages, { user: "You", text: chatInput }]);
      setChatInput("");
    }
  };

  // PUBLIC_INTERFACE
  // Handles copying invite link
  const handleCopyInvite = () => {
    navigator.clipboard.writeText(window.location.href + "?room=" + roomId);
    setShowInvite(true);
    setTimeout(() => setShowInvite(false), 1800);
  };

  // PUBLIC_INTERFACE
  // Handles play/pause (mock sync)
  const handleVideoControl = (action) => {
    if (!videoRef.current) return;
    if (action === "play") videoRef.current.play();
    if (action === "pause") videoRef.current.pause();
    // Sync logic would go here
  };

  // Layout:
  // Responsive: sidebar chat for desktop, bottom panel for mobile
  return (
    <div className="ss-app">
      <nav className="ss-navbar">
        <div className="ss-navbar-content">
          <div className="ss-logo">
            <span className="ss-logo-symbol">&#9654;</span>
            SyncStream
          </div>
          <div className="ss-room-controls">
            <span className="ss-room-label">Room:</span>
            <span className="ss-room-id">{roomId}</span>
            <button className="ss-btn ss-btn-accent" onClick={handleCopyInvite}>
              Invite
            </button>
            {showInvite && (
              <span className="ss-copied-label">Copied!</span>
            )}
          </div>
        </div>
      </nav>

      <main className="ss-main-content">
        <div className="ss-player-chat-layout">
          <section className="ss-player-section">
            <div className="ss-video-container">
              <video
                ref={videoRef}
                className="ss-video-player"
                controls
                // Use a fully remote image (no PUBLIC_URL involved)
                poster="https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=1200&q=80"
                style={{ width: "100%", borderRadius: "16px" }}
              >
                <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="ss-video-controls">
                <button
                  className="ss-btn ss-btn-primary"
                  onClick={() => handleVideoControl("play")}
                >
                  &#9658; Play
                </button>
                <button
                  className="ss-btn ss-btn-secondary"
                  onClick={() => handleVideoControl("pause")}
                >
                  &#10073;&#10073; Pause
                </button>
                {/* Room creation/join controls could go here */}
              </div>
            </div>
          </section>
          <aside className="ss-chat-section" aria-label="Group Chat">
            <div className="ss-chat-header">
              <span>Group Chat</span>
            </div>
            <div className="ss-chat-messages">
              {chatMessages.map((msg, i) => (
                <div
                  className={
                    "ss-chat-message" +
                    (msg.user === "You" ? " ss-chat-message-self" : "")
                  }
                  key={i}
                >
                  <span className="ss-chat-user">{msg.user}:</span>{" "}
                  <span className="ss-chat-text">{msg.text}</span>
                </div>
              ))}
            </div>
            <form className="ss-chat-input-row" onSubmit={handleSendMessage}>
              <input
                className="ss-chat-input"
                type="text"
                placeholder="Type a message..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                autoComplete="off"
              />
              <button className="ss-btn ss-btn-accent" type="submit">
                Send
              </button>
            </form>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default SyncStreamApp;
