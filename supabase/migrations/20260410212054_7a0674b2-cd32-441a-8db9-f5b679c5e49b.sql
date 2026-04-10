
ALTER TABLE public.private_messages ADD COLUMN IF NOT EXISTS image_url text DEFAULT null;
ALTER TABLE public.private_messages ADD COLUMN IF NOT EXISTS is_image_viewed boolean DEFAULT false;

ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS reply_to_username text DEFAULT null;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS reply_to_text text DEFAULT null;
