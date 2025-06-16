# SyncStream Supabase Backend Setup & Integration Guide

This document outlines how to set up SyncStream using [Supabase](https://supabase.com/) as the backend for authentication, room management, and group chat. It also provides **React integration examples** and important security considerations.

---

## Table of Contents

1. [Folder Structure & Overview](#folder-structure--overview)
2. [Supabase Project Setup](#supabase-project-setup)
3. [Environment Variables](#environment-variables)
4. [Database Schema & RLS Policies](#database-schema--rls-policies)
5. [Supabase Auth: Signup, Login, Session](#supabase-auth-signup-login-session)
6. [Room Management APIs](#room-management-apis)
7. [Chat APIs](#chat-apis)
8. [React Frontend Integration Examples](#react-frontend-integration-examples)
9. [Security Considerations](#security-considerations)
10. [References](#references)

---

## 1. Folder Structure & Overview

```
supabase_backend/
├── README.md         # This guide
├── schema.sql        # SQL: Tables + Row Level Security
└── api_examples/     # Sample API calls (JavaScript / curl)
```

---

## 2. Supabase Project Setup

1. **Create a project in [Supabase](https://app.supabase.com/).**
2. Save your project’s `SUPABASE_URL` and `SUPABASE_ANON_KEY`.

---

## 3. Environment Variables

For local development, add these to `.env` in `syncstream_frontend/` **(Never commit secrets to git!)**

```
REACT_APP_SUPABASE_URL=your-project-url
REACT_APP_SUPABASE_ANON_KEY=your-anon-public-key
```

---

## 4. Database Schema & RLS Policies

See `schema.sql` for SQL to run in Supabase SQL editor.

**Tables:**
- `rooms`: Each viewing room (id, created_by, created_at)
- `room_members`: Which users joined which rooms
- `messages`: Chat messages per room
- Supabase Auth handles `users`

**Row Level Security (RLS):**
- Only authenticated users can create/join rooms or send/read messages for their room.

---

## 5. Supabase Auth: Signup, Login, Session

### Install the JS library:

```bash
npm install @supabase/supabase-js
```

### Basic Auth Example (React):

```js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);

// PUBLIC_INTERFACE
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: "user@example.com",
  password: "secure-password"
});

// PUBLIC_INTERFACE
// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email: "user@example.com",
  password: "secure-password"
});

// PUBLIC_INTERFACE
// Detect session (auto updates on login/logout)
supabase.auth.onAuthStateChange((event, session) => {
  if(session) { /* user logged in */ }
  else { /* user logged out */ }
});
```

---

## 6. Room Management APIs

**Creating a Room (Insert):**
```js
const { data, error } = await supabase.from('rooms').insert([
  { created_by: user_id }
]);
```

**Joining a Room:**
```js
const { data, error } = await supabase.from('room_members').insert([
  { room_id: "abcd1234", user_id }
]);
```

**List Rooms (user is member):**
```js
const { data, error } = await supabase
  .from('room_members')
  .select('room_id')
  .eq('user_id', user_id);
```

---

## 7. Chat APIs

**Send Message:**
```js
const { data, error } = await supabase.from('messages').insert([
  { room_id, user_id, content: "hello world" }
]);
```

**Receive Messages (realtime subscription):**
```js
const channel = supabase.channel('room-messages')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'messages', filter: `room_id=eq.${room_id}` }, (payload) => {
    // Handle new or updated message: payload.new (message row)
  }).subscribe();
```

**Fetch Past Messages:**
```js
const { data, error } = await supabase
  .from('messages')
  .select('*')
  .eq('room_id', room_id)
  .order('created_at', { ascending: true });
```

---

## 8. React Frontend Integration Examples

See below for quickstart code snippets.

### a. **Initializing Supabase**

```js
// src/supabase.js
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);
export default supabase;
```
Then import `supabase` wherever needed in your React app.

---

### b. **User Signup / Login Example**

```js
import supabase from "./supabase";

// PUBLIC_INTERFACE: Register
async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  return { data, error };
}

// PUBLIC_INTERFACE: Login
async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
}
```

---

### c. **Session Detection (Auto-Login / Logout)**

```js
// React: detect current session and monitor changes.
import supabase from "./supabase";
import { useEffect, useState } from "react";

function useAuthSession() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    // Subscribe to changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => setSession(session)
    );
    return () => subscription.unsubscribe();
  }, []);

  return session;
}
```

---

### d. **Room and Chat Operations**

Refer to [Room Management APIs](#room-management-apis) and [Chat APIs](#chat-apis) above for functional code.

---

## 9. Security Considerations

- **Never expose `service_role` or admin keys in frontend. Only use `anon` key.**
- **Enable Row Level Security for all tables.** Auth users only access their data.
- **Validate all actions clientside as well.**
- Set up proper *realtime* subscription filters so users can only receive events for rooms they are joined to.
- For production: consider email verification, stricter policies, monitoring abuse, etc.

---

## 10. References

- [Supabase Docs](https://supabase.com/docs)
- [supabase-js Reference](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Realtime](https://supabase.com/docs/guides/realtime)

---
