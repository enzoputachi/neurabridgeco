
-- Add image_url column to posts
ALTER TABLE public.posts ADD COLUMN image_url text;

-- Marketplace items (courses, webinars, opportunities)
CREATE TABLE public.marketplace_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  expert_id uuid NOT NULL REFERENCES public.profiles(id),
  title text NOT NULL,
  description text NOT NULL,
  type text NOT NULL DEFAULT 'course',
  image_url text,
  price numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.marketplace_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view marketplace items"
  ON public.marketplace_items FOR SELECT
  USING (true);

CREATE POLICY "Experts can insert their own items"
  ON public.marketplace_items FOR INSERT
  TO authenticated
  WITH CHECK (expert_id = auth.uid() AND is_expert(auth.uid()));

CREATE POLICY "Experts can update their own items"
  ON public.marketplace_items FOR UPDATE
  TO authenticated
  USING (expert_id = auth.uid() AND is_expert(auth.uid()));

CREATE POLICY "Experts can delete their own items"
  ON public.marketplace_items FOR DELETE
  TO authenticated
  USING (expert_id = auth.uid());

CREATE TRIGGER update_marketplace_items_updated_at
  BEFORE UPDATE ON public.marketplace_items
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Expert followers
CREATE TABLE public.expert_followers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id uuid NOT NULL REFERENCES public.profiles(id),
  expert_id uuid NOT NULL REFERENCES public.profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(follower_id, expert_id)
);

ALTER TABLE public.expert_followers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view follower counts"
  ON public.expert_followers FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can follow"
  ON public.expert_followers FOR INSERT
  TO authenticated
  WITH CHECK (follower_id = auth.uid());

CREATE POLICY "Users can unfollow"
  ON public.expert_followers FOR DELETE
  TO authenticated
  USING (follower_id = auth.uid());

-- Messages
CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL REFERENCES public.profiles(id),
  receiver_id uuid NOT NULL REFERENCES public.profiles(id),
  content text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their messages"
  ON public.messages FOR SELECT
  TO authenticated
  USING (sender_id = auth.uid() OR receiver_id = auth.uid());

CREATE POLICY "Authenticated users can send messages"
  ON public.messages FOR INSERT
  TO authenticated
  WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Receivers can mark messages as read"
  ON public.messages FOR UPDATE
  TO authenticated
  USING (receiver_id = auth.uid());

-- Notifications
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id),
  type text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their notifications"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System can create notifications"
  ON public.notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their notifications"
  ON public.notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Post ratings
CREATE TABLE public.post_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  investor_id uuid NOT NULL REFERENCES public.profiles(id),
  score integer NOT NULL,
  comment text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(post_id, investor_id)
);

ALTER TABLE public.post_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view ratings"
  ON public.post_ratings FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can rate"
  ON public.post_ratings FOR INSERT
  TO authenticated
  WITH CHECK (investor_id = auth.uid());

CREATE POLICY "Users can update their ratings"
  ON public.post_ratings FOR UPDATE
  TO authenticated
  USING (investor_id = auth.uid());

-- Course reviews
CREATE TABLE public.course_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid NOT NULL REFERENCES public.marketplace_items(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id),
  score integer NOT NULL,
  comment text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(item_id, user_id)
);

ALTER TABLE public.course_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view course reviews"
  ON public.course_reviews FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can review"
  ON public.course_reviews FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their reviews"
  ON public.course_reviews FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Enable realtime for messages and notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
