
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS voice_url text DEFAULT null;
ALTER TABLE public.private_messages ADD COLUMN IF NOT EXISTS voice_url text DEFAULT null;

INSERT INTO storage.buckets (id, name, public) VALUES ('voice-messages', 'voice-messages', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can view voice messages"
ON storage.objects FOR SELECT
USING (bucket_id = 'voice-messages');

CREATE POLICY "Authenticated users can upload voice messages"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'voice-messages' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their own voice messages"
ON storage.objects FOR DELETE
USING (bucket_id = 'voice-messages' AND auth.uid()::text = (storage.foldername(name))[1]);
