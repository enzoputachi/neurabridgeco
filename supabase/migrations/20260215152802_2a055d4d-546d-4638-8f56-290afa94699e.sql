
-- Add booking_price to expert_profiles
ALTER TABLE public.expert_profiles ADD COLUMN booking_price numeric DEFAULT 0;

-- Create bookings table
CREATE TABLE public.bookings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  expert_id uuid NOT NULL REFERENCES public.profiles(id),
  investor_id uuid NOT NULL REFERENCES public.profiles(id),
  status text NOT NULL DEFAULT 'pending',
  scheduled_at timestamp with time zone,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bookings" ON public.bookings
FOR SELECT USING (investor_id = auth.uid() OR expert_id = auth.uid());

CREATE POLICY "Investors can create bookings" ON public.bookings
FOR INSERT WITH CHECK (investor_id = auth.uid());

CREATE POLICY "Experts can update booking status" ON public.bookings
FOR UPDATE USING (expert_id = auth.uid());

CREATE POLICY "Users can delete their bookings" ON public.bookings
FOR DELETE USING (investor_id = auth.uid() OR expert_id = auth.uid());

CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
