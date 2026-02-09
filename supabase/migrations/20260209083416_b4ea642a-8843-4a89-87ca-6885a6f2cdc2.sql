-- Create enums for user roles, post visibility, and subscription status
CREATE TYPE public.user_role AS ENUM ('investor', 'expert');
CREATE TYPE public.post_visibility AS ENUM ('public', 'private');
CREATE TYPE public.subscription_status AS ENUM ('active', 'pending', 'cancelled', 'expired');

-- Create profiles table (basic user info, linked to auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role public.user_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Create expert_profiles table (extended info for experts)
CREATE TABLE public.expert_profiles (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  bio TEXT,
  credentials TEXT,
  headline TEXT,
  markets TEXT[] DEFAULT '{}',
  subscription_price DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create posts table
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expert_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  asset TEXT,
  market TEXT,
  timeframe TEXT,
  visibility public.post_visibility NOT NULL DEFAULT 'public',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create subscriptions table
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  expert_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status public.subscription_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (investor_id, expert_id)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expert_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Create security definer helper functions

-- Check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.user_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Check if user is an expert
CREATE OR REPLACE FUNCTION public.is_expert(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'expert')
$$;

-- Check if user is an investor
CREATE OR REPLACE FUNCTION public.is_investor(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'investor')
$$;

-- Check if subscription is active between investor and expert
CREATE OR REPLACE FUNCTION public.is_subscribed(_investor_id UUID, _expert_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.subscriptions
    WHERE investor_id = _investor_id
      AND expert_id = _expert_id
      AND status = 'active'
  )
$$;

-- RLS Policies for profiles
CREATE POLICY "Anyone can view profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own role on signup"
  ON public.user_roles FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for expert_profiles
CREATE POLICY "Anyone can view expert profiles"
  ON public.expert_profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Experts can insert their own profile"
  ON public.expert_profiles FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid() AND public.is_expert(auth.uid()));

CREATE POLICY "Experts can update their own profile"
  ON public.expert_profiles FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() AND public.is_expert(auth.uid()));

-- RLS Policies for posts
CREATE POLICY "Anyone can view public posts"
  ON public.posts FOR SELECT
  TO authenticated
  USING (
    visibility = 'public'
    OR expert_id = auth.uid()
    OR (visibility = 'private' AND public.is_subscribed(auth.uid(), expert_id))
  );

CREATE POLICY "Allow public to view public posts"
  ON public.posts FOR SELECT
  TO anon
  USING (visibility = 'public');

CREATE POLICY "Experts can insert their own posts"
  ON public.posts FOR INSERT
  TO authenticated
  WITH CHECK (expert_id = auth.uid() AND public.is_expert(auth.uid()));

CREATE POLICY "Experts can update their own posts"
  ON public.posts FOR UPDATE
  TO authenticated
  USING (expert_id = auth.uid());

CREATE POLICY "Experts can delete their own posts"
  ON public.posts FOR DELETE
  TO authenticated
  USING (expert_id = auth.uid());

-- RLS Policies for subscriptions
CREATE POLICY "Users can view their own subscriptions"
  ON public.subscriptions FOR SELECT
  TO authenticated
  USING (investor_id = auth.uid() OR expert_id = auth.uid());

CREATE POLICY "Investors can create subscriptions"
  ON public.subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (investor_id = auth.uid() AND public.is_investor(auth.uid()));

CREATE POLICY "Investors can update their subscriptions"
  ON public.subscriptions FOR UPDATE
  TO authenticated
  USING (investor_id = auth.uid());

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply updated_at triggers
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_expert_profiles_updated_at
  BEFORE UPDATE ON public.expert_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create function to handle new user registration (creates profile automatically)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'username',
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to auto-create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();