-- SigmaPay persistence schema. Apply in Supabase SQL Editor or through Supabase CLI.
create extension if not exists pgcrypto;

create table if not exists public."User" (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null,
  "fullName" text not null default '',
  email text not null unique,
  phone text not null unique,
  address text not null default '',
  enabled boolean not null default true,
  "twoFAEnabled" boolean not null default false,
  "passwordHash" text,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists public."LoginActivity" (
  id uuid primary key default gen_random_uuid(),
  "userId" uuid references public."User"(id) on delete cascade,
  email text,
  at timestamptz not null default now(),
  device text not null,
  ip text not null,
  status text not null
);

create table if not exists public."Budget" (
  id uuid primary key default gen_random_uuid(),
  "userId" uuid not null references public."User"(id) on delete cascade,
  "totalAmount" numeric not null,
  "startDate" text not null,
  "endDate" text not null,
  categories text[] not null default '{}',
  spent numeric not null default 0,
  currency text not null default 'USD',
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists public."Transaction" (
  id uuid primary key default gen_random_uuid(),
  "userId" uuid not null references public."User"(id) on delete cascade,
  type text not null,
  amount numeric not null,
  category text not null,
  "transactionType" text,
  date text,
  description text,
  "paymentMethod" text,
  "budgetId" uuid references public."Budget"(id) on delete set null,
  at timestamptz not null,
  "createdAt" timestamptz not null default now()
);

create table if not exists public."Goal" (
  id uuid primary key default gen_random_uuid(),
  "userId" uuid not null references public."User"(id) on delete cascade,
  "goalType" text not null,
  title text not null,
  "targetAmount" numeric not null,
  "currentAmount" numeric not null default 0,
  deadline text not null,
  "priorityLevel" text not null,
  state text not null,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists public."PaymentTransaction" (
  id uuid primary key default gen_random_uuid(),
  "userId" uuid not null references public."User"(id) on delete cascade,
  "methodId" text not null,
  amount numeric not null,
  "merchantId" text,
  status text not null,
  at timestamptz not null default now(),
  "createdAt" timestamptz not null default now(),
  note text,
  "refundRequested" boolean not null default false,
  "refundAmount" numeric,
  "refundReason" text
);

create table if not exists public."SavingsGroup" (
  id uuid primary key default gen_random_uuid(),
  "groupName" text not null,
  "targetAmount" numeric not null default 0,
  "currentAmount" numeric not null default 0,
  "memberIds" uuid[] not null default '{}',
  "createdBy" uuid not null references public."User"(id) on delete cascade,
  "createdAt" timestamptz not null default now()
);

create table if not exists public."GroupContribution" (
  id uuid primary key default gen_random_uuid(),
  "groupId" uuid not null references public."SavingsGroup"(id) on delete cascade,
  "memberId" uuid not null references public."User"(id) on delete cascade,
  amount numeric not null,
  at timestamptz not null default now()
);

create table if not exists public."Notification" (
  id uuid primary key default gen_random_uuid(),
  "userId" uuid not null references public."User"(id) on delete cascade,
  title text not null default '',
  message text not null,
  type text not null,
  read boolean not null default false,
  at timestamptz not null default now()
);

create table if not exists public."NotificationPreference" (
  id uuid primary key default gen_random_uuid(),
  "userId" uuid not null unique references public."User"(id) on delete cascade,
  push boolean not null default false,
  sms boolean not null default false,
  email boolean not null default false,
  "updatedAt" timestamptz not null default now()
);

create table if not exists public."Bill" (
  id uuid primary key default gen_random_uuid(),
  "userId" uuid not null references public."User"(id) on delete cascade,
  provider text not null,
  "accountRef" text not null,
  amount numeric not null,
  "dueAt" timestamptz not null,
  recurring boolean not null default false,
  "createdAt" timestamptz not null default now()
);

create index if not exists transaction_user_idx on public."Transaction" ("userId", at desc);
create index if not exists notification_user_idx on public."Notification" ("userId", at desc);
create index if not exists budget_user_idx on public."Budget" ("userId");
create index if not exists goal_user_idx on public."Goal" ("userId");
