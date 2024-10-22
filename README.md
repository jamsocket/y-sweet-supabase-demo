<a href="https://y-sweet-supabase-demo.netlify.app/" align="center">
  <img src="/app/opengraph-image.png" alt="opengraph-image" style="display: block; margin: 0 auto;" />
  <h1 align="center">Y-Sweet and Supabase Starter Kit</h1>
</a>

<p align="center">
 The fastest way to build apps with Supabase and Y-Sweet
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#demo"><strong>Demo</strong></a> ·
  <a href="#deploy-to-netlify"><strong>Deploy to Netlify</strong></a> ·
  <a href="#clone-and-run-locally"><strong>Clone and run locally</strong></a>
</p>
<br/>

## Features

- A full-fledged collaborative text editor
  - Live collaboration
  - Document permissions
  - User management
  - Document persistence
  - It just works!

## How Supabase and Y-Sweet work together

Use Y-Sweet for document collaboration.
- Y-Sweet is a Yjs sync server with built-in persistence to S3. This demo uses Y-Sweet to sync and persist documents as users edit.

Use Supabase for document management.
- Supabase manages everything around the document, from document permissions to user authentication.

## Demo

You can view a fully working demo at [demo-y-sweet-supabase.netlify.app](https://demo-y-sweet-supabase.netlify.app/).

## Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/extension/start/deploy?repository=https://github.com/jamsocket/y-sweet-supabase-demo)

The above will also clone the Starter kit to your GitHub, you can clone that locally and develop locally.

Once you've added this project to Netlify, install the Jamsocket and Supabase extensions to add the necessary environment variables for your application.

If you wish to just develop locally and not deploy to Netlify, [follow the steps below](#clone-and-run-locally).

## Clone and run locally

1. Create a Y-Sweet service [via the Jamsocket dashboard](https://app.jamsocket.com)

1. Create Supabase project [via the Supabase dashboard](https://database.new)

2. Create a Next.js app using the Y-Sweet Supabase Starter template npx command

   ```bash
   npx create-next-app -e with-y-sweet-supabase
   ```

3. Use `cd` to change into the app's directory

   ```bash
   cd name-of-new-app
   ```

4. Rename `.env.example` to `.env.local` and update the following:

   ```
   NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[INSERT SUPABASE PROJECT API ANON KEY]
   Y_SWEET_CONNECTION_STRING=[INSERT Y_SWEET CONNECTION STRING]
   ```

   Both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` can be found in [your Supabase project's API settings](https://app.supabase.com/project/_/settings/api)

   You can create a connection string in [your Y-Sweet service page](https://app.jamsocket.com) and supply the value to `Y_SWEET_CONNECTION_STRING`

5. Configure your Supabase Database using the SQL editor in the Supabase Dashboard to store and retrieve document metadata for your app.
   ``` sql
   CREATE TABLE public.docs (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY, -- Unique identifier for the document
      doc_id text NOT NULL, -- Document ID string
      is_public boolean,
      name text
    );

    CREATE TABLE public.permissions (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY, -- Unique identifier for the permission
      user_id uuid REFERENCES auth.users (id) ON DELETE CASCADE, -- User ID, references the users table
      doc_id uuid REFERENCES public.docs (id) ON DELETE CASCADE, -- Document ID, references the docs table
      permission_type text NOT NULL -- Permission type (e.g., 'read', 'write')
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
   ```

6. You can now run the Next.js local development server:

   ```bash
   npm run dev
   ```

   The starter kit should now be running on [localhost:3000](http://localhost:3000/).

7. Y-Sweet allows you to choose where you persist your documents. This demo uses Y-Sweets Bring Your Own Storage feature to automatically persist your document to your own AWS S3 Bucket. Contact us to get set up, or explore Supabase's own blog storage service.
