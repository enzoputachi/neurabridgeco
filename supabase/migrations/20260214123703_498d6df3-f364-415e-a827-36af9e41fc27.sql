
-- Fix expert_profiles SELECT policy to be permissive
DROP POLICY IF EXISTS "Anyone can view expert profiles" ON public.expert_profiles;
CREATE POLICY "Anyone can view expert profiles"
ON public.expert_profiles FOR SELECT
TO anon, authenticated
USING (true);

-- Fix posts SELECT policy to be permissive for public posts
DROP POLICY IF EXISTS "Anyone can view public posts" ON public.posts;
CREATE POLICY "Anyone can view public posts"
ON public.posts FOR SELECT
TO anon, authenticated
USING (
  (visibility = 'public'::post_visibility)
  OR (expert_id = auth.uid())
  OR ((visibility = 'private'::post_visibility) AND is_subscribed(auth.uid(), expert_id))
);

-- Fix marketplace_items SELECT policy to be permissive
DROP POLICY IF EXISTS "Anyone can view marketplace items" ON public.marketplace_items;
CREATE POLICY "Anyone can view marketplace items"
ON public.marketplace_items FOR SELECT
TO anon, authenticated
USING (true);

-- Fix profiles SELECT policy to be permissive
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;
CREATE POLICY "Anyone can view profiles"
ON public.profiles FOR SELECT
TO anon, authenticated
USING (true);

-- Fix post_comments SELECT policy to be permissive
DROP POLICY IF EXISTS "Anyone can view comments" ON public.post_comments;
CREATE POLICY "Anyone can view comments"
ON public.post_comments FOR SELECT
TO anon, authenticated
USING (true);

-- Fix post_likes SELECT policy to be permissive
DROP POLICY IF EXISTS "Anyone can view likes" ON public.post_likes;
CREATE POLICY "Anyone can view likes"
ON public.post_likes FOR SELECT
TO anon, authenticated
USING (true);

-- Fix post_ratings SELECT policy to be permissive
DROP POLICY IF EXISTS "Anyone can view ratings" ON public.post_ratings;
CREATE POLICY "Anyone can view ratings"
ON public.post_ratings FOR SELECT
TO anon, authenticated
USING (true);

-- Fix expert_followers SELECT policy to be permissive
DROP POLICY IF EXISTS "Anyone can view follower counts" ON public.expert_followers;
CREATE POLICY "Anyone can view follower counts"
ON public.expert_followers FOR SELECT
TO anon, authenticated
USING (true);

-- Fix course_reviews SELECT policy to be permissive
DROP POLICY IF EXISTS "Anyone can view course reviews" ON public.course_reviews;
CREATE POLICY "Anyone can view course reviews"
ON public.course_reviews FOR SELECT
TO anon, authenticated
USING (true);
