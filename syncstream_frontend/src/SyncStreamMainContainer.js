import React, { useRef, useState } from "react";
import "./SyncStreamMainContainer.css";

// PUBLIC_INTERFACE
/**
 * SyncStreamMainContainer: The central React component for SyncStream.
 * Features:
 * - Responsive video player with custom controls (no sync backend, demo logic only)
 * - Sidebar/bottom panel group chat
 * - Room creation & invite UI
 * - Responsive, modern layout with light theme and custom palette
 */
function SyncStreamMainContainer() {
  // Demo room mechanics (not connected)
  const [room, setRoom] = useState(null);
  const [roomInput, setRoomInput] = useState("");
  const [inviteUrl, setInviteUrl] = useState(null);

  // Demo synchronized player state
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  // Demo chat mechanics
  const [chat, setChat] = useState([
    { sender: "System", text: "Welcome to SyncStream!" }
  ]);
  const [chatInput, setChatInput] = useState("");

  // Handler for room
  const handleCreateRoom = () => {
    // For demo, just randomize a room ID and show invite
    const rid = "room-" + Math.floor(Math.random() * 10000);
    setRoom(rid);
    setInviteUrl(window.location.origin + "/join/" + rid);
  };
  const handleJoinRoom = () => {
    setRoom(roomInput);
    setInviteUrl(window.location.origin + "/join/" + roomInput);
  };

  // Demo video controls
  const handlePlayPause = () => {
    const v = videoRef.current;
    if (v) {
      if (v.paused) {
        v.play();
        setIsPlaying(true);
      } else {
        v.pause();
        setIsPlaying(false);
      }
    }
  };
  const handleSeek = (e) => {
    const v = videoRef.current;
    if (!v) return;
    const seekTo = Number(e.target.value);
    v.currentTime = seekTo;
    setCurrentTime(seekTo);
  };
  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (v) setCurrentTime(v.currentTime);
  };

  // Demo chat send
  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChat([...chat, { sender: "You", text: chatInput }]);
    setChatInput("");
  };

  // Responsive layout helper
  const isMobile = window.innerWidth < 720;

  return (
    <div className="syncstream-root">
      <header className="ss-header">
        <div className="ss-logo">
          <span className="ss-logo-symbol">⏯️</span> SyncStream
        </div>
        <div className="ss-room-ui">
          {!room ? (
            <div className="ss-room-controls">
              <button className="ss-btn ss-accent" onClick={handleCreateRoom}>
                Create Room
              </button>
              <span className="ss-divider">or</span>
              <input
                className="ss-input"
                type="text"
                value={roomInput}
                onChange={(e) => setRoomInput(e.target.value)}
                placeholder="Join with Room ID"
              />
              <button
                className="ss-btn"
                onClick={handleJoinRoom}
                disabled={!roomInput}
              >
                Join
              </button>
            </div>
          ) : (
            <div className="ss-room-info">
              <span className="ss-room-id">
                <b>Room:</b> {room}
              </span>
              {inviteUrl && (
                <span className="ss-invite-url">
                  Invite:{" "}
                  <input
                    className="ss-invite-input"
                    value={inviteUrl}
                    readOnly
                    onFocus={(e) => e.target.select()}
                  />
                </span>
              )}
            </div>
          )}
        </div>
      </header>
      <main
        className={
          isMobile ? "ss-main ss-mobile" : "ss-main"
        }
      >
        <section className="ss-video-box">
          <div className="ss-video-container">
            <video
              ref={videoRef}
              className="ss-video-player"
              src="https://www.w3schools.com/html/mov_bbb.mp4"
              poster="https://peach.blender.org/wp-content/uploads/title_anouncement.jpg?x11217"
              onTimeUpdate={handleTimeUpdate}
              width="100%"
              height="auto"
              controls={false}
            />
            <div className="ss-controls">
              <button
                aria-label={isPlaying ? "Pause" : "Play"}
                className="ss-btn ss-pale"
                onClick={handlePlayPause}
              >
                {isPlaying ? "❚❚" : "►"}
              </button>
              <input
                type="range"
                min={0}
                max={60}
                value={currentTime}
                onChange={handleSeek}
                className="ss-slider"
              />
              <span className="ss-timestamp">
                {Math.floor(currentTime)}&nbsp;/ 60s
              </span>
              <span className="ss-label">Demo playback (no sync)</span>
            </div>
          </div>
        </section>
        {/* Chat -- sidebar on desktop, panel on mobile */}
        <aside className={isMobile ? "ss-chat ss-chat-mobile" : "ss-chat"}>
          <div className="ss-chat-title">Group Chat</div>
          <div className="ss-chat-history">
            {chat.map((msg, i) => (
              <div key={i} className="ss-chat-msg">
                <span className="ss-chat-sender">{msg.sender}:</span>
                <span className="ss-chat-text">{msg.text}</span>
              </div>
            ))}
          </div>
          <form className="ss-chat-form" onSubmit={handleSendChat}>
            <input
              className="ss-chat-input"
              type="text"
              placeholder="Type a message"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              autoComplete="off"
            />
            <button className="ss-btn ss-accent" type="submit">
              Send
            </button>
          </form>
        </aside>
      </main>
      <footer className="ss-footer">
        Movie nights, together – SyncStream © {new Date().getFullYear()}
      </footer>
    </div>
  );
}

export default SyncStreamMainContainer;
