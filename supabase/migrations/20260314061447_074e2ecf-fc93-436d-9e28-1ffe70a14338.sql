
-- Add status column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status text DEFAULT null;

-- Insert country rooms for Yemen, Iraq, Syria, Lebanon, Qatar
INSERT INTO public.rooms (name, description, image, is_pinned) VALUES
  ('غرفة اليمن', 'غرفة دردشة لأهل اليمن', '🇾🇪', false),
  ('غرفة العراق', 'غرفة دردشة لأهل العراق', '🇮🇶', false),
  ('غرفة سوريا', 'غرفة دردشة لأهل سوريا', '🇸🇾', false),
  ('غرفة لبنان', 'غرفة دردشة لأهل لبنان', '🇱🇧', false),
  ('غرفة قطر', 'غرفة دردشة لأهل قطر', '🇶🇦', false)
ON CONFLICT DO NOTHING;
