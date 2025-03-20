CREATE TABLE public.profiles (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL REFERENCES auth.users(id),
    username text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone
);

CREATE TABLE public.usage_stats (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL REFERENCES auth.users(id),
    api_calls bigint DEFAULT 0,
    last_used timestamp with time zone,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.api_models (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    description text,
    required_plan text,
    created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own profiles"
    ON profiles
    FOR ALL
    USING (auth.uid() = user_id);

ALTER TABLE public.profiles
    ALTER COLUMN created_at SET DEFAULT now(),
    ALTER COLUMN updated_at SET DEFAULT now();

ALTER TABLE public.profiles
    ALTER COLUMN username SET NOT NULL;
ALTER TABLE public.usage_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_models ENABLE ROW LEVEL SECURITY;