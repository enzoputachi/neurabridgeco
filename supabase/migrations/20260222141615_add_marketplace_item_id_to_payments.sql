alter table public.payments 
  add column marketplace_item_id uuid null 
  references marketplace_items(id) on delete set null;

-- Update the context check to include marketplace items
alter table public.payments 
  drop constraint payments_has_context;

alter table public.payments
  add constraint payments_has_context check (
    (subscription_id is not null) 
    or (booking_id is not null) 
    or (marketplace_item_id is not null)
  );