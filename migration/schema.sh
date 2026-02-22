
# MODEL SCHEMA
create table public.payments (
  id uuid not null default gen_random_uuid (),
  investor_id uuid not null, # who made the payment
  expert_id uuid not null, # who received the payment
  subscription_id uuid not null,
  amount numeric not null,
  currency text not null default 'NGN'::text,
  status text not null default 'pending'::text,
  payment_method text null,
  paystack_reference text null,
  transaction_id text null,
  created_at timestamp with time zone not null default now(),
  completed_at timestamp with time zone null,
  constraint payments_pkey primary key (id),
  constraint payments_paystack_reference_key unique (paystack_reference),
  constraint payments_expert_id_fkey foreign KEY (expert_id) references auth.users (id),
  constraint payments_investor_id_fkey foreign KEY (investor_id) references auth.users (id),
  constraint payments_subscription_id_fkey foreign KEY (subscription_id) references subscriptions (id),
  constraint payments_status_check check (
    (
      status = any (
        array[
          'pending'::text,
          'completed'::text,
          'failed'::text,
          'refunded'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_payments_paystack_reference on public.payments using btree (paystack_reference) TABLESPACE pg_default;

create index IF not exists idx_payments_status on public.payments using btree (status) TABLESPACE pg_default;


###



## NEW SCHEMA BEURABRIDGECO
##############################################################

create table public.profiles (
  id uuid not null,
  username text null,
  full_name text null,
  avatar_url text null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint profiles_pkey primary key (id),
  constraint profiles_id_fkey foreign KEY (id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;

create trigger set_profiles_updated_at BEFORE
update on profiles for EACH row
execute FUNCTION handle_updated_at ();


######################################################################
create table public.user_roles (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null,
  role public.user_role not null,
  created_at timestamp with time zone not null default now(),
  constraint user_roles_pkey primary key (id),
  constraint user_roles_user_id_role_key unique (user_id, role),
  constraint user_roles_user_id_fkey foreign KEY (user_id) references profiles (id) on delete CASCADE
) TABLESPACE pg_default;

####################################################


create table public.subscriptions (
  id uuid not null default gen_random_uuid (),
  investor_id uuid not null,
  expert_id uuid not null,
  status public.subscription_status not null default 'active'::subscription_status,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint subscriptions_pkey primary key (id),
  constraint subscriptions_investor_id_expert_id_key unique (investor_id, expert_id),
  constraint subscriptions_expert_id_fkey foreign KEY (expert_id) references profiles (id) on delete CASCADE,
  constraint subscriptions_investor_id_fkey foreign KEY (investor_id) references profiles (id) on delete CASCADE
) TABLESPACE pg_default;

create trigger set_subscriptions_updated_at BEFORE
update on subscriptions for EACH row
execute FUNCTION handle_updated_at ();