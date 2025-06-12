import React, { useState, useRef, useEffect } from 'react';
import { supabase } from './supabaseClient'; // Supabase client

// PUBLIC_INTERFACE
/**
 * Main container for SyncStream App.
 *
 * Centralizes the synchronized video player, chat panel, and room management with responsive modern UI and custom colors.
 */
function SyncStreamMain() {
  // Room state
  const [roomId, setRoomId] = useState('');
  const [hasJoined, setHasJoined] = useState(false); // true after Create/Join
  const [inviteLink, setInviteLink] = useState('');
  // Chat state
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  // Synchronized playback state
  const [videoUrl, setVideoUrl] = useState('');
  const [inputUrl, setInputUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [videoError, setVideoError] = useState('');
  const [loadingRoom, setLoadingRoom] = useState(false);

  const videoRef = useRef(null);
  const channelRef = useRef(null);

  // --- Supabase Room Table Config ---
  // Table name: 'rooms'
  // Columns: id (UUID or text), video_url (text)

  // --- Room Management ---
  // PUBLIC_INTERFACE
  async function handleRoomCreate() {
    // "Generate" room id (for mock/demo)
    const id = Math.random().toString(36).substr(2, 7).toUpperCase();
    setRoomId(id);
    setHasJoined(true);
    setInviteLink(window.location.origin + '/?room=' + id);

    // Insert new room into Supabase if it doesn't exist
    setLoadingRoom(true);
    try {
      const { error } = await supabase.from('rooms').upsert({ id, video_url: '' }, { onConflict: ['id'] });
      if (error) {
        setVideoError('Error creating room in Supabase');
      }
    } catch (e) {
      setVideoError('Could not create room in backend');
    }
    setLoadingRoom(false);

    // Subscribe to this room's updates
    subscribeToRoom(id);
  }

  // PUBLIC_INTERFACE
  async function handleRoomJoin() {
    if (roomId.trim()) {
      setLoadingRoom(true);

      // Fetch room state from Supabase if exists
      const { data, error } = await supabase.from('rooms').select('video_url').eq('id', roomId.trim()).single();

      if (!error && data) {
        setVideoUrl(data.video_url || '');
        setInputUrl(data.video_url || '');
        setHasJoined(true);
        setInviteLink(window.location.origin + '/?room=' + roomId.trim());
        subscribeToRoom(roomId.trim());
      } else {
        setVideoError('Room does not exist. Please check the Room ID.');
      }
      setLoadingRoom(false);
    }
  }

  // SUBSCRIBE to the room's video sync
  function subscribeToRoom(roomIdToSubscribe) {
    // Clean up previous subscription
    if (channelRef.current) {
      channelRef.current.unsubscribe();
      channelRef.current = null;
    }
    // PUBLIC_INTERFACE
    /**
     * Subscribes to Supabase realtime updates for a room's video_url.
     */
    const channel = supabase
      .channel('room_' + roomIdToSubscribe)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'rooms', filter: `id=eq.${roomIdToSubscribe}` },
        (payload) => {
          if (payload.new && payload.new.video_url !== undefined) {
            setVideoUrl(payload.new.video_url);
            setInputUrl(payload.new.video_url);
            setPlaybackTime(0);
            setIsPlaying(false);
            setVideoError('');
            if (videoRef.current) {
              videoRef.current.currentTime = 0;
              videoRef.current.pause();
            }
          }
        }
      )
      .subscribe();
    channelRef.current = channel;
  }

  // --- Video Controls (Synced) ---
  async function handleUrlSet() {
    setVideoError('');
    // Only update local state if not in a room, otherwise use Supabase
    if (!roomId) {
      setVideoUrl(inputUrl.trim());
      setPlaybackTime(0);
      setIsPlaying(false);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.pause();
      }
      return;
    }
    // Write to Supabase => all clients in room will update
    setLoadingRoom(true);
    const { error } = await supabase.from('rooms').update({ video_url: inputUrl.trim() }).eq('id', roomId);
    if (error) {
      setVideoError('Failed to set video. Supabase error.');
      setLoadingRoom(false);
      return;
    }
    setLoadingRoom(false);
    // Don't setVideoUrl directly here; rely on realtime subscription to update
  }

  function handlePlayPause() {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
    setIsPlaying(!isPlaying);
  }

  function handleSeek(time) {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
    setPlaybackTime(time);
  }

  function handleVideoTimeUpdate(e) {
    setPlaybackTime(Math.floor(e.target.currentTime));
  }

  // --- Group Chat ---
  function handleChatSend(e) {
    e.preventDefault();
    const trimmed = chatInput.trim();
    if (trimmed) {
      setMessages((msgs) => [
        ...msgs,
        { user: 'Me', text: trimmed, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
      setChatInput('');
    }
  }

  // Copy invite link to clipboard
  function handleCopyInvite() {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink);
    }
  }

  // Responsive: sidebar chat if width > 700px, else bottom drawer
  const isWide = window.innerWidth > 700;

  // Color palette (inline for demo, would be in CSS vars)
  const palette = {
    primary: '#1a252e',
    secondary: '#3c1526',
    accent: '#610f0f',
    light: '#fafbfc',
    chatBubble: '#e7e9ea',
    border: '#e5e8eb'
  };

  return (
    <div className="ss-main-root" style={{
      minHeight: '100vh',
      background: palette.light,
      color: palette.primary
    }}>
      <header className="ss-navbar" style={{
        background: palette.primary,
        color: '#fff',
        padding: '18px 30px',
        borderBottom: `1px solid ${palette.border}`,
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        letterSpacing: '1px'
      }}>
        <span className="ss-logo" style={{
          color: palette.accent,
          fontWeight: 800,
          marginRight: 10,
          fontSize: '1.6rem'
        }}>⏯</span> SyncStream
      </header>
      <main className="ss-main-content" style={{
        display: 'flex',
        flexDirection: isWide ? 'row' : 'column',
        alignItems: 'stretch',
        justifyContent: 'center',
        maxWidth: 1200,
        margin: '40px auto 0 auto',
        height: 'calc(100vh - 90px)',
        boxSizing: 'border-box',
        gap: isWide ? 30 : 0,
        transition: 'flex-direction 0.2s'
      }}>
        {/* Left: Main Area */}
        <section className="ss-main-center" style={{
          flex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: isWide ? '38px 40px 20px 40px' : '26px 8vw 10px 8vw',
          background: '#fff',
          borderRadius: 16,
          minWidth: isWide ? 400 : 'unset',
          marginBottom: isWide ? 0 : 18,
          boxShadow: '0 2px 24px 2px rgba(26,37,46,0.1)'
        }}>
          {/* Room management */}
          <div className="ss-room-bar" style={{
            display: 'flex',
            gap: 16,
            alignItems: 'center',
            marginBottom: 22,
            width: '100%',
            flexWrap: 'wrap'
          }}>
            {!hasJoined ? (
              <>
                <input
                  style={inputBoxStyle}
                  type="text"
                  placeholder="Room ID"
                  value={roomId}
                  onChange={e => setRoomId(e.target.value.replace(/\s/g,''))}
                  maxLength={12}
                />
                <button
                  style={buttonStyle(palette.primary, true)}
                  onClick={handleRoomJoin}
                  disabled={!roomId.trim()}
                >Join Room</button>
                <span style={{ color: '#aaa'}}>or</span>
                <button
                  style={buttonStyle(palette.accent)}
                  onClick={handleRoomCreate}
                >Create Room</button>
              </>
            ) : (
              <>
                <span style={{ fontWeight: 500, letterSpacing: '1.2px', color: palette.secondary }}>
                  Room: <span style={{ color: palette.accent }}>{roomId}</span>
                </span>
                {inviteLink && (
                  <>
                    <span style={{
                      background: palette.chatBubble,
                      padding: '5px 10px',
                      borderRadius: '5px',
                      fontSize: '0.98em',
                      color: palette.primary
                    }}>
                      Share: <span style={{ wordBreak: 'break-all' }}>{inviteLink}</span>
                    </span>
                    <button
                      style={buttonStyle(palette.primary, false, 'small')}
                      onClick={handleCopyInvite}
                    >Copy Invite</button>
                  </>
                )}
              </>
            )}
          </div>
          {/* Video URL Set */}
          {hasJoined && (
            <div className="ss-video-urlbar" style={{
              width: '100%',
              marginBottom: 18,
              display: 'flex',
              gap: 10
            }}>
              <input
                style={inputBoxStyle}
                type="text"
                placeholder="Paste YouTube/Direct Video URL here"
                value={inputUrl}
                onChange={e => setInputUrl(e.target.value)}
                maxLength={1000}
              />
              <button
                style={buttonStyle(palette.accent, false, 'small')}
                onClick={handleUrlSet}
                disabled={!inputUrl.trim()}
              >Set Video</button>
            </div>
          )}
          {/* Video Player */}
          <div className="ss-video-player-wrap" style={{
            background: '#111',
            borderRadius: 12,
            width: '100%',
            maxWidth: 560,
            minHeight: 318,
            aspectRatio: '16/9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            marginBottom: 14,
            flexDirection: 'column'
          }}>
            {videoError && (
              <div style={{ color: '#f33', marginTop: 10, marginBottom: 6, fontWeight: 600, fontSize: '1rem' }}>
                {videoError}
              </div>
            )}
            {videoUrl ? (
              // Render either a native video element or an iframe for YouTube, based on URL
              isYouTubeUrl(videoUrl) ? (
                <iframe
                  title="YouTube Player"
                  width="100%"
                  height="100%"
                  src={getYouTubeEmbedUrl(videoUrl)}
                  style={{ borderRadius: 12, background: '#222', maxWidth: '100%', minHeight: 318, border: 'none' }}
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                ></iframe>
              ) : isDirectVideoUrl(videoUrl) ? (
                <video
                  ref={videoRef}
                  src={videoUrl}
                  width="100%"
                  height="100%"
                  style={{ borderRadius: 12, background: '#222', maxWidth: '100%' }}
                  controls={false}
                  onTimeUpdate={handleVideoTimeUpdate}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onError={() => setVideoError('Could not load video. Check your link or format.')}
                >
                  Sorry, your browser does not support embedded videos.
                </video>
              ) : (
                <span style={{ color: '#f33', fontWeight: 500 }}>
                  Could not recognize this link as a supported video. Please use a public YouTube or direct MP4/WebM URL.
                </span>
              )
            ) : (
              <span style={{ color: '#eee', textAlign: 'center', fontWeight: 500 }}>
                Paste a video URL to watch with your group!
              </span>
            )}
            {/* Controls Overlay (sync demo) */}
            {videoUrl && (
              <div className="ss-player-controls" style={{
                position: 'absolute',
                bottom: 10,
                left: 0, right: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 18,
                zIndex: 4
              }}>
                <button
                  aria-label="Play/Pause"
                  style={buttonStyle(palette.primary, true, 'large', true)}
                  onClick={handlePlayPause}
                >
                  {isPlaying ? '⏸ Pause' : '▶️ Play'}
                </button>
                <span style={{
                  background: palette.chatBubble,
                  color: palette.secondary,
                  padding: '3px 13px',
                  borderRadius: 6,
                  fontWeight: 500
                }}>
                  {formatTime(playbackTime)}
                </span>
                {/* Seek Demo: -10s | +10s */}
                <button
                  style={buttonStyle(palette.secondary, true, 'small')}
                  onClick={() => handleSeek(Math.max(0, playbackTime - 10))}
                  disabled={playbackTime < 10}
                >-10s</button>
                <button
                  style={buttonStyle(palette.secondary, true, 'small')}
                  onClick={() => handleSeek(playbackTime + 10)}
                >+10s</button>
              </div>
            )}
          </div>
        </section>
        {/* Right: Chat Panel */}
        {hasJoined && isWide && (
          <aside className="ss-chat-sidebar" style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            background: palette.primary,
            borderRadius: 16,
            color: '#fff',
            padding: '30px 22px 18px 22px',
            minWidth: 260,
            maxWidth: 360,
            marginTop: 0,
            overflow: 'hidden',
            boxShadow: '0 2px 18px rgba(58,16,39,0.11)'
          }}>
            <GroupChatPanel
              messages={messages}
              chatInput={chatInput}
              setChatInput={setChatInput}
              handleChatSend={handleChatSend}
            />
          </aside>
        )}
      </main>
      {/* Mobile Chat Drawer */}
      {hasJoined && !isWide && (
        <div className="ss-mobile-chatdrawer" style={{
          position: 'fixed',
          left: 0, right: 0,
          bottom: 0,
          background: palette.primary,
          color: '#fff',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          boxShadow: '0 0 16px 4px #610f0f22',
          padding: '14px 13px 10px 13px',
          zIndex: 99,
        }}>
          <GroupChatPanel
            messages={messages}
            chatInput={chatInput}
            setChatInput={setChatInput}
            handleChatSend={handleChatSend}
          />
        </div>
      )}
    </div>
  );
}

// Helper: Chat panel as a subcomponent
// PUBLIC_INTERFACE
function GroupChatPanel({ messages, chatInput, setChatInput, handleChatSend }) {
  return (
    <div className="ss-group-chat" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}>
      <div className="ss-chat-title"
        style={{ fontWeight: 700, marginBottom: 10, fontSize: '1.23rem', letterSpacing: '.5px' }}>
        💬 Group Chat
      </div>
      <div className="ss-chat-messages" style={{
        flex: 1,
        overflowY: 'auto',
        marginBottom: 10,
        background: '#13191e',
        borderRadius: 8,
        padding: '10px 7px 10px 13px',
        fontSize: '1.04em'
      }}>
        {messages.length === 0 ? (
          <div style={{ color: '#aaa', paddingTop: 14, textAlign: 'center', fontStyle: 'italic' }}>
            Start chatting with your group!
          </div>
        ) : messages.map((msg, idx) => (
          <div key={idx} style={{
            marginBottom: 9,
            display:'flex',
            alignItems:'center',
            gap:4
          }}>
            <span style={{
              color: '#e7a741',
              fontWeight: 600,
              marginRight: 4,
              fontSize: '1em'
            }}>{msg.user}</span>
            <span style={{
              background: '#fff',
              color: '#3c1526',
              borderRadius: 6,
              fontWeight: 400,
              padding: '4px 9px'
            }}>{msg.text}</span>
            <span style={{
              fontSize: '0.85em',
              color: '#fff7',
              marginLeft: 8
            }}>{msg.time}</span>
          </div>
        ))}
      </div>
      <form
        style={{ display: 'flex', gap: 6 }}
        onSubmit={handleChatSend}
        autoComplete="off"
      >
        <input
          style={{
            flex: 1,
            fontSize: '1.1em',
            borderRadius: 6,
            border: '1.5px solid #d2d1d8',
            padding: '7px 10px',
            outline: 'none'
          }}
          name="chatInput"
          autoComplete="off"
          type="text"
          value={chatInput}
          placeholder="Type a message…"
          onChange={e => setChatInput(e.target.value)}
          maxLength={220}
        />
        <button
          type="submit"
          style={{
            background: '#610f0f',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            fontSize: '1em',
            fontWeight: 600,
            padding: '0 17px',
            cursor: chatInput.trim() ? 'pointer' : 'not-allowed',
            opacity: chatInput.trim() ? 1 : 0.55
          }}
          disabled={!chatInput.trim()}
          aria-label="Send"
        >
          Send
        </button>
      </form>
    </div>
  );
}

// Helper: Button styling
function buttonStyle(bg='#112', withShadow=false, size='medium', rounded) {
  return {
    background: bg,
    color: '#fff',
    border: 'none',
    borderRadius: rounded === false ? 4 : 7,
    fontSize: size === 'large' ? '1.1rem' : size === 'small' ? '0.97rem' : '1rem',
    padding: size === 'large'
      ? '11px 24px'
      : size === 'small'
      ? '7px 16px'
      : '9px 19px',
    fontWeight: 600,
    boxShadow: withShadow ? '0 1px 4px #13203522' : undefined,
    cursor: 'pointer',
    transition: 'background .18s, color .12s'
  };
}

// Helper: Input styling
const inputBoxStyle = {
  border: '1.5px solid #b4c3d2',
  borderRadius: 6,
  padding: '9px 13px',
  fontSize: '1.08em',
  marginRight: 0,
  flex: 1,
  minWidth: 100
};

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

/**
 * Checks if a URL is a YouTube share/link.
 */
function isYouTubeUrl(url) {
  if (!url) return false;
  return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(url);
}

/**
 * Converts YouTube public URL/watch to embeddable iframe src
 */
function getYouTubeEmbedUrl(url) {
  // Typical: https://www.youtube.com/watch?v=VIDEOID
  // Or: https://youtu.be/VIDEOID
  let videoIdMatch = url.match(/[?&]v=([^&#]+)/);
  if (videoIdMatch) return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
  // youtu.be short link
  videoIdMatch = url.match(/youtu\.be\/([^?&#]+)/);
  if (videoIdMatch) return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
  return url; // fallback, might still be valid
}

/**
 * Checks if URL is a direct link to video (mp4, webm, ogg)
 */
function isDirectVideoUrl(url) {
  if (!url) return false;
  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);
}

export default SyncStreamMain;
