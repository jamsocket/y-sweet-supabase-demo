CREATE TABLE public.docs (
    id varchar(256) PRIMARY KEY NOT NULL, -- Unique identifier for the document
    is_public boolean,
    name text
);

CREATE TABLE public.permissions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY, -- Unique identifier for the permission
    user_id uuid REFERENCES auth.users (id) ON DELETE CASCADE, -- User ID, references the users table
    doc_id varchar(256) REFERENCES public.docs (id) ON DELETE CASCADE, -- Document ID, references the docs table
    CONSTRAINT unique_user_doc_permission UNIQUE (user_id, doc_id) -- Ensure unique combination
);

CREATE TABLE public.users (
    id uuid not null primary key, -- UUID from auth.users
    email text
);
comment on table public.users is 'Profile data for each user.';
comment on column public.users.id is 'References the internal Supabase Auth user.';

CREATE OR REPLACE function public.handle_new_user()
returns trigger as $$
begin
    insert into public.users (id, email)
    values (new.id, new.email);
    return new;
end;
$$ language plpgsql security definer;

CREATE trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();
