-- SyncStream Supabase Schema & RLS Policies
-- Run this in the Supabase SQL Editor

-- USERS handled by Supabase Auth

-- ROOMS ----------------------------------------
create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  created_by uuid references auth.users not null,
  created_at timestamptz default now()
);

-- ROOM MEMBERS -------------------------------
create table if not exists public.room_members (
  id bigserial primary key,
  room_id uuid references public.rooms on delete cascade,
  user_id uuid references auth.users on delete cascade,
  joined_at timestamptz default now(),
  unique(room_id, user_id)
);

-- CHAT MESSAGES ------------------------------
create table if not exists public.messages (
  id bigserial primary key,
  room_id uuid references public.rooms on delete cascade,
  user_id uuid references auth.users on delete cascade,
  content text not null,
  created_at timestamptz default now()
);

-- Enable RLS ----------------------------------
alter table public.rooms enable row level security;
alter table public.room_members enable row level security;
alter table public.messages enable row level security;

-- RLS Policies

-- Only logged-in user can create room
create policy "Allow room owner" on public.rooms
  for insert using (auth.uid() = created_by);

-- Only room creator or members can see the room
create policy "Room read as owner or member" on public.rooms
  for select using (
    auth.uid() = created_by
    or exists (select 1 from public.room_members m where m.room_id = id and m.user_id = auth.uid())
  );

-- Only room members can join a room
create policy "Self can join room" on public.room_members
  for insert using (
    auth.uid() = user_id
  );
create policy "Self can see own room memberships" on public.room_members
  for select using (
    auth.uid() = user_id
  );

-- Only members can send/read messages to their room
create policy "Can post message to joined room" on public.messages
  for insert using (
    exists (select 1 from public.room_members where room_id = public.messages.room_id and user_id = auth.uid())
  );

create policy "Can read messages from joined room" on public.messages
  for select using (
    exists (select 1 from public.room_members where room_id = public.messages.room_id and user_id = auth.uid())
  );
