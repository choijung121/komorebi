-- Komorebi MVP v1 schema + RLS + invite RPC
-- Apply in Supabase SQL Editor.

-- Enable UUID generation
create extension if not exists pgcrypto;

-- Rooms
create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Room admins (multi-admin)
create table if not exists public.room_admins (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (room_id, user_id)
);

-- Groups within a room
create table if not exists public.groups (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  name text not null,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (id, room_id)
);

-- Group membership (user can be in only one group per room)
create table if not exists public.group_members (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  group_id uuid not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (room_id, user_id),
  unique (group_id, user_id),
  constraint group_members_group_room_fk foreign key (group_id, room_id)
    references public.groups (id, room_id) on delete cascade
);

-- Room settings
create table if not exists public.room_settings (
  room_id uuid primary key references public.rooms(id) on delete cascade,
  allow_downloads boolean not null default false,
  is_archived boolean not null default false,
  updated_at timestamptz not null default now()
);

-- Media (photo | video)
create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  uploader_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('photo', 'video')),
  url text not null,
  thumbnail_url text,
  created_at timestamptz not null default now(),
  unique (id, room_id)
);

-- Comments (group scoped)
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  group_id uuid not null,
  media_id uuid not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  constraint comments_group_room_fk foreign key (group_id, room_id)
    references public.groups (id, room_id) on delete cascade,
  constraint comments_media_room_fk foreign key (media_id, room_id)
    references public.media (id, room_id) on delete cascade
);

-- Reactions (group scoped)
create table if not exists public.reactions (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  group_id uuid not null,
  media_id uuid not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  created_at timestamptz not null default now(),
  unique (media_id, group_id, user_id, type),
  constraint reactions_group_room_fk foreign key (group_id, room_id)
    references public.groups (id, room_id) on delete cascade,
  constraint reactions_media_room_fk foreign key (media_id, room_id)
    references public.media (id, room_id) on delete cascade
);

-- Invites (token based, expirable)
create table if not exists public.invites (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  group_id uuid not null references public.groups(id) on delete cascade,
  token text not null unique,
  created_by uuid not null references auth.users(id) on delete cascade,
  expires_at timestamptz,
  redeemed_by uuid references auth.users(id) on delete set null,
  redeemed_at timestamptz,
  is_revoked boolean not null default false,
  created_at timestamptz not null default now()
);

-- Utility functions (must be defined after tables)
create or replace function public.is_room_admin(rid uuid)
returns boolean
language sql
stable
as $$
  select exists(
    select 1 from public.room_admins ra
    where ra.room_id = rid and ra.user_id = auth.uid()
  );
$$;

create or replace function public.is_room_member(rid uuid)
returns boolean
language sql
stable
as $$
  select exists(
    select 1 from public.group_members gm
    where gm.room_id = rid and gm.user_id = auth.uid()
  );
$$;

create or replace function public.is_group_member(gid uuid)
returns boolean
language sql
stable
as $$
  select exists(
    select 1 from public.group_members gm
    where gm.group_id = gid and gm.user_id = auth.uid()
  );
$$;

-- RLS enablement
alter table public.rooms enable row level security;
alter table public.room_admins enable row level security;
alter table public.groups enable row level security;
alter table public.group_members enable row level security;
alter table public.room_settings enable row level security;
alter table public.media enable row level security;
alter table public.comments enable row level security;
alter table public.reactions enable row level security;
alter table public.invites enable row level security;

-- Rooms policies
create policy rooms_select on public.rooms
  for select using (public.is_room_admin(id) or public.is_room_member(id));

create policy rooms_insert on public.rooms
  for insert with check (auth.uid() = created_by);

create policy rooms_update on public.rooms
  for update using (public.is_room_admin(id)) with check (public.is_room_admin(id));

-- Room admins policies
create policy room_admins_select on public.room_admins
  for select using (public.is_room_admin(room_id));

create policy room_admins_insert on public.room_admins
  for insert with check (public.is_room_admin(room_id));
create policy room_admins_delete on public.room_admins
  for delete using (public.is_room_admin(room_id));

-- Groups policies
create policy groups_select on public.groups
  for select using (public.is_room_admin(room_id) or public.is_room_member(room_id));

create policy groups_insert on public.groups
  for insert with check (public.is_room_admin(room_id));

-- Group members policies
create policy group_members_select on public.group_members
  for select using (public.is_room_admin(room_id) or public.is_room_member(room_id));

create policy group_members_insert on public.group_members
  for insert with check (
    public.is_room_admin(room_id) or auth.uid() = user_id
  );

-- Room settings policies
create policy room_settings_select on public.room_settings
  for select using (public.is_room_admin(room_id) or public.is_room_member(room_id));

create policy room_settings_upsert on public.room_settings
  for all using (public.is_room_admin(room_id)) with check (public.is_room_admin(room_id));

-- Media policies
create policy media_select on public.media
  for select using (public.is_room_admin(room_id) or public.is_room_member(room_id));

create policy media_insert on public.media
  for insert with check (public.is_room_admin(room_id));

-- Comments policies (group scoped)
create policy comments_select on public.comments
  for select using (
    public.is_room_admin(room_id) or public.is_group_member(group_id)
  );

create policy comments_insert on public.comments
  for insert with check (
    public.is_room_admin(room_id) or public.is_group_member(group_id)
  );

-- Reactions policies (group scoped)
create policy reactions_select on public.reactions
  for select using (
    public.is_room_admin(room_id) or public.is_group_member(group_id)
  );

create policy reactions_insert on public.reactions
  for insert with check (
    public.is_room_admin(room_id) or public.is_group_member(group_id)
  );

-- Invites policies
create policy invites_select on public.invites
  for select using (public.is_room_admin(room_id));

create policy invites_insert on public.invites
  for insert with check (public.is_room_admin(room_id));

create policy invites_update on public.invites
  for update using (public.is_room_admin(room_id)) with check (public.is_room_admin(room_id));

-- RPC to accept invite
create or replace function public.accept_invite(invite_token text)
returns table(room_id uuid, group_id uuid)
language plpgsql
security definer
as $$
declare
  v_invite record;
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    raise exception 'not_authenticated';
  end if;

  select * into v_invite
  from public.invites i
  where i.token = invite_token
    and i.is_revoked = false
    and (i.expires_at is null or i.expires_at > now())
    and i.redeemed_at is null
  limit 1;

  if v_invite is null then
    raise exception 'invalid_or_expired_invite';
  end if;

  -- Enforce one group per room
  if exists (
    select 1 from public.group_members gm
    where gm.room_id = v_invite.room_id and gm.user_id = v_uid
  ) then
    raise exception 'already_in_room';
  end if;

  insert into public.group_members (room_id, group_id, user_id)
  values (v_invite.room_id, v_invite.group_id, v_uid);

  update public.invites
  set redeemed_by = v_uid, redeemed_at = now()
  where id = v_invite.id;

  return query select v_invite.room_id, v_invite.group_id;
end;
$$;

-- Grant execute on RPC
grant execute on function public.accept_invite(text) to authenticated;
