<img src="/app/opengraph-image.png" alt="opengraph-image" style="display: block; margin: 0 auto;" />
<h1 align="center">Jamsocket and Supabase Starter Kit</h1>

<p align="center">
 The fastest way to build apps with Supabase and Y-Sweet by Jamsocket
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

## How Supabase and Jamsocket work together

Use Y-Sweet, Jamsocket's Yjs server, for document collaboration.

- Y-Sweet is a Yjs sync server with built-in persistence to S3. This demo uses Y-Sweet to sync and persist documents as users edit.

Use Supabase for document management.

- Supabase manages everything around the document, from document permissions to user authentication.

## Demo

You can view a fully working demo at [demo-y-sweet-supabase.netlify.app](https://demo-y-sweet-supabase.netlify.app/).

## Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/extension/start/deploy?repository=https://github.com/jamsocket/y-sweet-supabase-demo)

The above will also clone the Starter kit to your GitHub, you can clone that locally and develop locally.

Once you've added this project to Netlify, install the [Jamsocket](https://app.netlify.com/extensions/jamsocket) and [Supabase](https://app.netlify.com/extensions/supabase) extensions to add the necessary environment variables for your application.

If you wish to just develop locally and not deploy to Netlify, [follow the steps below](#clone-and-run-locally).

## Clone and run locally

1. Create a Y-Sweet service [via the Jamsocket dashboard](https://app.jamsocket.com)

2. Create Supabase project [via the Supabase dashboard](https://database.new)

3. Clone the Y-Sweet Supabase Starter template using

   ```bash
   gh repo clone jamsocket/y-sweet-supabase-demo
   ```
   ```bash
   git clone git@github.com:jamsocket/y-sweet-supabase-demo.git
   ```

4. Rename `.env.example` to `.env.local` and update the following:

   ```
   NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[INSERT SUPABASE PROJECT API ANON KEY]
   Y_SWEET_CONNECTION_STRING=[INSERT Y_SWEET CONNECTION STRING]
   ```

   Both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` can be found in [your Supabase project's API settings](https://app.supabase.com/project/_/settings/api)

   Create a connection string in [your Y-Sweet service page](https://app.jamsocket.com) and supply the value to `Y_SWEET_CONNECTION_STRING`

5. Setup your database on [Supabase](https://supabase.com/) and run the commands in `setup.sql`

6. You can now run the Next.js local development server:

   ```bash
   npm install
   ```

   ```bash
   npm run dev
   ```

   The starter kit should now be running on [localhost:3000](http://localhost:3000/).

7. Y-Sweet allows you to choose where you persist your documents. This demo uses Y-Sweet's [Bring Your Own Storage](https://app.jamsocket.com/) feature to automatically persist your document to your own AWS S3 Bucket. [Contact us](mailto:hi@jamsocket.com) to get set up, or explore Supabase's [storage service](https://supabase.com/docs/guides/storage).
