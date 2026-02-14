-- Allow users to delete their own messages (for conversation deletion)
CREATE POLICY "Users can delete their own messages"
ON public.messages
FOR DELETE
TO anon, authenticated
USING (sender_id = auth.uid() OR receiver_id = auth.uid());
