-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Authenticated users can review" ON public.course_reviews;
DROP POLICY IF EXISTS "Users can update their reviews" ON public.course_reviews;
DROP POLICY IF EXISTS "Anyone can view course reviews" ON public.course_reviews;

-- Recreate as permissive policies
CREATE POLICY "Anyone can view course reviews"
  ON public.course_reviews FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can review"
  ON public.course_reviews FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their reviews"
  ON public.course_reviews FOR UPDATE
  USING (user_id = auth.uid());