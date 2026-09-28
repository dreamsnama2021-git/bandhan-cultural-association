
create sequence public.member_number_seq start 1100;

create table public.members (
  id uuid primary key references auth.users (id) on delete cascade,
  member_id text not null unique,
  full_name text not null,
  email text not null,
  mobile text not null default '',
  address text not null default '',
  city text not null default '',
  membership_type text not null default 'general' check (membership_type in ('core', 'general')),
  role text not null default 'member' check (role in ('member', 'leader')),
  family_count integer not null default 0,
  pujas text[] not null default '{}',
  joined_on date not null default current_date,
  valid_until date not null default (current_date + interval '1 year'),
  created_at timestamptz not null default now()
);

create table public.family_members (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members (id) on delete cascade,
  name text not null,
  contact text not null default '',
  age text not null default '',
  created_at timestamptz not null default now()
);

create index family_members_member_id_idx on public.family_members (member_id);

alter table public.members enable row level security;
alter table public.family_members enable row level security;

create policy "members read own row" on public.members
  for select to authenticated using ((select auth.uid()) = id);

create policy "members update own row" on public.members
  for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

revoke update on public.members from authenticated;
grant update (full_name, mobile, address, city) on public.members to authenticated;

create policy "family read own" on public.family_members
  for select to authenticated using ((select auth.uid()) = member_id);
create policy "family insert own" on public.family_members
  for insert to authenticated with check ((select auth.uid()) = member_id);
create policy "family update own" on public.family_members
  for update to authenticated using ((select auth.uid()) = member_id) with check ((select auth.uid()) = member_id);
create policy "family delete own" on public.family_members
  for delete to authenticated using ((select auth.uid()) = member_id);

-- Builds the member record from the signup metadata. Role is never read from
-- metadata, so users cannot make themselves leaders.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  fam jsonb := coalesce(meta -> 'family_members', '[]'::jsonb);
  fam_item jsonb;
  puja_list text[];
  plan text := case when meta ->> 'membership_type' = 'core' then 'core' else 'general' end;
begin
  select coalesce(array_agg(p), '{}') into puja_list
  from jsonb_array_elements_text(coalesce(meta -> 'pujas', '[]'::jsonb)) as p;

  insert into public.members (id, member_id, full_name, email, mobile, address, city, membership_type, family_count, pujas)
  values (
    new.id,
    'BCA-' || extract(year from current_date)::int || '-' || nextval('public.member_number_seq'),
    coalesce(nullif(meta ->> 'full_name', ''), split_part(new.email, '@', 1)),
    new.email,
    coalesce(meta ->> 'mobile', ''),
    coalesce(meta ->> 'address', ''),
    coalesce(meta ->> 'city', ''),
    plan,
    jsonb_array_length(fam),
    puja_list
  );

  for fam_item in select * from jsonb_array_elements(fam) loop
    insert into public.family_members (member_id, name, contact, age)
    values (
      new.id,
      coalesce(fam_item ->> 'name', ''),
      coalesce(fam_item ->> 'contact', ''),
      coalesce(fam_item ->> 'age', '')
    );
  end loop;

  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
