-- New transactions table (richer than legacy payments)
CREATE TABLE IF NOT EXISTS public.transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type text NOT NULL DEFAULT 'consultation',
  amount_mzn numeric NOT NULL,
  method text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  description text,
  reference text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tx select own" ON public.transactions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "tx insert own" ON public.transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "tx update own" ON public.transactions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_transactions_user ON public.transactions(user_id, created_at DESC);

-- Subscription expiry on profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS subscription_expires_at timestamptz;