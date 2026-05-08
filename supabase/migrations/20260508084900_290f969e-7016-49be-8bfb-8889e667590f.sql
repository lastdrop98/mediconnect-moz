
-- Prescriptions table
CREATE TABLE public.prescriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  doctor_id UUID NOT NULL,
  patient_id UUID NOT NULL,
  medications TEXT NOT NULL,
  dosage TEXT,
  validity_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "prescriptions select own"
ON public.prescriptions FOR SELECT
USING (auth.uid() = doctor_id OR auth.uid() = patient_id);

CREATE POLICY "prescriptions insert by doctor"
ON public.prescriptions FOR INSERT
WITH CHECK (auth.uid() = doctor_id);

CREATE POLICY "prescriptions update by doctor"
ON public.prescriptions FOR UPDATE
USING (auth.uid() = doctor_id);

CREATE POLICY "prescriptions delete by doctor"
ON public.prescriptions FOR DELETE
USING (auth.uid() = doctor_id);

-- Health alerts: add expires_at
ALTER TABLE public.health_alerts
  ADD COLUMN IF NOT EXISTS expires_at DATE;
