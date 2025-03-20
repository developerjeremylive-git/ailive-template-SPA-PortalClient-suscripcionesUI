-- Migrations will appear here as you chat with AI

create table users (
  id bigint primary key generated always as identity,
  username text not null unique,
  email text not null unique,
  password_hash text not null,
  created_at timestamp with time zone default now(),
  last_login timestamp with time zone
);

create table plans (
  id bigint primary key generated always as identity,
  name text not null,
  description text,
  price numeric(10, 2) not null,
  features text[0]
);

create table subscriptions (
  id bigint primary key generated always as identity,
  user_id bigint not null references users (id),
  plan_id bigint not null references plans (id),
  start_date timestamp with time zone default now(),
  end_date timestamp with time zone,
  status text not null
);

create table domains (
  id bigint primary key generated always as identity,
  user_id bigint not null references users (id),
  domain_name text not null unique,
  registration_date timestamp with time zone default now(),
  expiry_date timestamp with time zone
);

create table invoices (
  id bigint primary key generated always as identity,
  user_id bigint not null references users (id),
  amount numeric(10, 2) not null,
  issued_date timestamp with time zone default now(),
  due_date timestamp with time zone,
  status text not null
);

create table supporttickets (
  id bigint primary key generated always as identity,
  user_id bigint not null references users (id),
  subject text not null,
  description text,
  status text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone
);

drop table if exists supporttickets;

drop table if exists domains;

create table activitylogs (
  id bigint primary key generated always as identity,
  user_id bigint not null references users (id),
  action text not null,
  "timestamp" timestamp with time zone default now(),
  details text
);

create table notifications (
  id bigint primary key generated always as identity,
  user_id bigint not null references users (id),
  message text not null,
  sent_at timestamp with time zone default now(),
  read boolean default false
);

create table stripetransactions (
  id bigint primary key generated always as identity,
  subscription_id bigint not null references subscriptions (id),
  stripe_transaction_id text not null,
  amount numeric(10, 2) not null,
  currency text not null,
  status text not null,
  created_at timestamp with time zone default now(),
  error_message text
);

create table stripecustomers (
  id bigint primary key generated always as identity,
  user_id bigint not null references users (id),
  stripe_customer_id text not null unique,
  created_at timestamp with time zone default now()
);

create table planchangehistory (
  id bigint primary key generated always as identity,
  subscription_id bigint not null references subscriptions (id),
  old_plan_id bigint references plans (id),
  new_plan_id bigint references plans (id),
  change_date timestamp with time zone default now()
);

create table refundrequests (
  id bigint primary key generated always as identity,
  subscription_id bigint not null references subscriptions (id),
  amount numeric(10, 2) not null,
  reason text,
  status text not null,
  request_date timestamp with time zone default now(),
  processed_date timestamp with time zone
);

create table promotions (
  id bigint primary key generated always as identity,
  code text not null unique,
  discount_percentage numeric(5, 2) not null,
  start_date timestamp with time zone not null,
  end_date timestamp with time zone not null,
  conditions text
);

create table userpreferences (
  id bigint primary key generated always as identity,
  user_id bigint not null references users (id),
  notification_settings text,
  theme text,
  language text
);

drop table if exists promotions;

create table promotions (
  id bigint primary key generated always as identity,
  plan_id bigint not null references plans (id),
  code text not null unique,
  discount_percentage numeric(5, 2) not null,
  start_date timestamp with time zone not null,
  end_date timestamp with time zone not null,
  conditions text
);

alter table stripetransactions
add column promotion_id bigint references promotions (id);

alter table planchangehistory
alter column old_plan_id
set not null;

create table webhookevents (
  id bigint primary key generated always as identity,
  event_id text not null unique,
  event_type text not null,
  payload jsonb not null,
  received_at timestamp with time zone default now(),
  processed boolean default false
);

create table paymentmethods (
  id bigint primary key generated always as identity,
  user_id bigint not null references users (id),
  method_id text not null unique,
  method_type text not null,
  status text not null,
  created_at timestamp with time zone default now()
);

alter table invoices
add column stripe_transaction_id bigint references stripetransactions (id);

alter table stripetransactions
add column payment_method_id bigint references paymentmethods (id);