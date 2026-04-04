
-- Blocks table
CREATE TABLE public.blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id uuid NOT NULL,
  blocked_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(blocker_id, blocked_id)
);
ALTER TABLE public.blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their blocks" ON public.blocks
  FOR SELECT TO authenticated USING (auth.uid() = blocker_id);
CREATE POLICY "Users can block others" ON public.blocks
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = blocker_id);
CREATE POLICY "Users can unblock" ON public.blocks
  FOR DELETE TO authenticated USING (auth.uid() = blocker_id);

-- Reports table
CREATE TABLE public.reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid NOT NULL,
  reported_id uuid NOT NULL,
  reason text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can report" ON public.reports
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "Users can view own reports" ON public.reports
  FOR SELECT TO authenticated USING (auth.uid() = reporter_id);

-- User roles for admin
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- Admins can view all reports
CREATE POLICY "Admins can view all reports" ON public.reports
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Admins can update report status
CREATE POLICY "Admins can update reports" ON public.reports
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Role policies
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
