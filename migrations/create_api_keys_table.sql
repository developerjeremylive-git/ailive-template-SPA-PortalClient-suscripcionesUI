create table api_keys (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) not null,
    service_type text not null,
    key_value text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    -- Asegura que un usuario solo tenga una clave por tipo de servicio
    unique(user_id, service_type)
);

-- Añadir políticas de seguridad RLS (Row Level Security)
alter table api_keys enable row level security;

-- Política para que los usuarios solo puedan ver y modificar sus propias claves
create policy "Users can manage their own API keys"
    on api_keys
    for all
    using (auth.uid() = user_id);