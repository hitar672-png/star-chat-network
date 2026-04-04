
-- Add font_color and likes_count to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS font_color text DEFAULT NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS likes_count integer NOT NULL DEFAULT 0;

-- Gifts table
CREATE TABLE public.gifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL,
  receiver_id uuid NOT NULL,
  gift_type text NOT NULL,
  gift_name text NOT NULL,
  gift_icon text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.gifts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their gifts" ON public.gifts
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Authenticated users can send gifts" ON public.gifts
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = sender_id);

-- Likes table
CREATE TABLE public.likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  liker_id uuid NOT NULL,
  liked_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(liker_id, liked_id)
);

ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view likes" ON public.likes
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can like" ON public.likes
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = liker_id);

CREATE POLICY "Users can unlike" ON public.likes
  FOR DELETE TO authenticated USING (auth.uid() = liker_id);

-- Function to update likes_count and level
CREATE OR REPLACE FUNCTION public.update_likes_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_count integer;
  new_level integer;
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE profiles SET likes_count = likes_count + 1 WHERE user_id = NEW.liked_id;
    SELECT likes_count INTO new_count FROM profiles WHERE user_id = NEW.liked_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE profiles SET likes_count = GREATEST(likes_count - 1, 0) WHERE user_id = OLD.liked_id;
    SELECT likes_count INTO new_count FROM profiles WHERE user_id = OLD.liked_id;
  END IF;

  -- Level progression: every 10 likes = 1 level
  new_level := GREATEST(1, 1 + (new_count / 10));
  UPDATE profiles SET level = new_level WHERE user_id = COALESCE(NEW.liked_id, OLD.liked_id);

  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER on_like_change
AFTER INSERT OR DELETE ON public.likes
FOR EACH ROW EXECUTE FUNCTION public.update_likes_count();

-- Enable realtime for private messages notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.gifts;
