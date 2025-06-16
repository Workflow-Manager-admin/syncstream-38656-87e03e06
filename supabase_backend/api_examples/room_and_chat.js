/**
 * SyncStream Room & Chat Supabase API Examples (JS)
 * (Assume you're in React app with supabase.js already initialized)
 */

// --- PREREQUISITES -------------------
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

// --- ROOM MANAGEMENT -----------------

// PUBLIC_INTERFACE
// Create a new room, returns room id
export async function createRoom() {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Not logged in");
  const { data, error } = await supabase.from("rooms").insert([{ created_by: user.id }]).select().single();
  if (error) throw error;
  return data.id;
}

// PUBLIC_INTERFACE
// Join a room by id (adds to room_members)
export async function joinRoom(room_id) {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Not logged in");
  const { error } = await supabase.from("room_members").insert([{ room_id, user_id: user.id }]);
  if (error && !error.message.includes("duplicate key")) throw error;
  // duplicate OK (user already joined)
}

// PUBLIC_INTERFACE
// Get all rooms the user is a member of
export async function getMyRooms() {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Not logged in");
  const { data, error } = await supabase
    .from("room_members")
    .select("room_id")
    .eq("user_id", user.id);
  if (error) throw error;
  return data.map(r => r.room_id);
}

// --- CHAT ----------------------------

// PUBLIC_INTERFACE
// Send chat message to room
export async function sendMessage(room_id, text) {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Not logged in");
  const { error } = await supabase.from("messages").insert([{ room_id, user_id: user.id, content: text }]);
  if (error) throw error;
}

// PUBLIC_INTERFACE
// Subscribe to chat messages for a room (realtime)
export function onRoomMessages(room_id, callback) {
  // Returns unsubscribe function
  return supabase.channel("room-messages")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "messages", filter: `room_id=eq.${room_id}` },
      payload => {
        callback(payload.eventType, payload.new);
      }
    )
    .subscribe();
}

// PUBLIC_INTERFACE
// Load previous messages
export async function getRoomMessages(room_id) {
  const { data, error } = await supabase
    .from("messages")
    .select("*, user: user_id(email)")
    .eq("room_id", room_id)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data;
}

