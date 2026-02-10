-- Update handle_new_user to also create user_roles and expert_profiles from metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _role text;
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'username',
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'avatar_url'
  );

  -- Insert role if provided in metadata
  _role := NEW.raw_user_meta_data ->> 'role';
  IF _role IN ('investor', 'expert') THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, _role::user_role);

    -- If expert, create expert profile
    IF _role = 'expert' THEN
      INSERT INTO public.expert_profiles (user_id)
      VALUES (NEW.id);
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- Make sure trigger exists on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Drop the duplicate posts SELECT policy
DROP POLICY IF EXISTS "Allow public to view public posts" ON public.posts;

-- Fix user_roles: also allow the trigger (service role) to work, and let users read roles
-- The existing policies are fine for reads, the trigger bypasses RLS via SECURITY DEFINER