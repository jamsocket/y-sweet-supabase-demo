<img src="/app/opengraph-image.png" alt="opengraph-image" style="display: block; margin: 0 auto;" />
<h1 align="center">
<a href="https://y-sweet-supabase-demo.netlify.app">Jamsocket and Supabase Starter Kit</a>
</h1>

<p align="center">
 The fastest way to build apps with Supabase and Y-Sweet by Jamsocket
</p>

<p align="center">
<a href="#introduction"><strong>Introduction</strong></a> ·
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#clone-and-run-locally"><strong>Clone and run locally</strong></a> ·
  <a href="#deploy-to-netlify"><strong>Deploy to Netlify</strong></a>
</p>
<br/>

## Introduction

The Jamsocket and Supabase Starter Kit shows you how to implement core features of a real-time application like Google Docs. It covers collaborative text editing with Y-Sweet and document management with Supabase.

[Try it live](https://y-sweet-supabase-demo.netlify.app)

## Features

A full-fledged collaborative text editor with:
- **Live Collaboration**: Real-time sync powered by Y-Sweet, Jamsocket's Yjs server with built-in persistence to AWS S3.
- **Slate Rich Text Editor**: A fully customizable editor interface.
- **Document Permissions & User Management**: Managed through Supabase, which handles authentication, permissions, and document storage.
- **Easy Persistence**: Bring Your Own Storage (BYOS) with S3 or use Supabase's native storage service.
- **Effortless Deployment**: Ready for local development or deployment to Netlify.

## How Supabase and Jamsocket work together

Use [Y-Sweet](https://jamsocket.com/y-sweet), Jamsocket's Yjs server, for document collaboration.

- Y-Sweet is a Yjs sync server with built-in persistence to S3. This demo uses Y-Sweet to sync and persist documents as users edit.

Use [Supabase](https://supabase.com/) for document management.

- Supabase manages everything around the document, from document permissions to user authentication.

## Clone and run locally

1. Create a Y-Sweet service [via the Jamsocket dashboard](https://app.jamsocket.com)

2. Create a Supabase project [via the Supabase dashboard](https://database.new)

3. Clone the Y-Sweet Supabase Starter template using

   ```bash
   gh repo clone jamsocket/y-sweet-supabase-demo
   ```

   ```bash
   git clone git@github.com:jamsocket/y-sweet-supabase-demo.git
   ```

4. Rename `.env.example` to `.env.local` and update the following:

   ```
   NEXT_PUBLIC_SUPABASE_DATABASE_URL=[INSERT SUPABASE PROJECT URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[INSERT SUPABASE PROJECT API ANON KEY]
   Y_SWEET_CONNECTION_STRING=[INSERT Y_SWEET CONNECTION STRING]
   ```

   Both `NEXT_PUBLIC_SUPABASE_DATABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` can be found in [your Supabase project's API settings](https://app.supabase.com/project/_/settings/api)

   Create a connection string in [your Y-Sweet service page](https://app.jamsocket.com) and supply the value to `Y_SWEET_CONNECTION_STRING`

5. Setup your database on [Supabase](https://supabase.com/) and run the commands in `setup.sql`

6. In the [Auth Providers](https://supabase.com/dashboard/project/_/auth/providers) page, disable `Confirm Email` under `Email`. For the purposes of this demo, disabling `Confirm Email` will allow us to focus on the application logic itself.

7. You can now run the Next.js local development server:

   ```bash
   npm install
   ```

   ```bash
   npm run dev
   ```

   The starter kit should now be running on [localhost:3000](http://localhost:3000/).

8. Y-Sweet allows you to choose where you persist your documents. This demo uses Y-Sweet's [Bring Your Own Storage](https://app.jamsocket.com/) feature to automatically persist your document to your own AWS S3 Bucket. [Contact us](mailto:hi@jamsocket.com) to get set up, or explore Supabase's [storage service](https://supabase.com/docs/guides/storage).

## Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/extension/start/deploy?repository=https://github.com/jamsocket/y-sweet-supabase-demo)

The above will also clone the Starter kit to your GitHub, you can clone that locally and develop locally.

Once you've added this project to Netlify, install the [Jamsocket](https://app.netlify.com/extensions/jamsocket) and [Supabase](https://app.netlify.com/extensions/supabase) extensions to add the necessary environment variables for your application.

[Try our live demo.](https://y-sweet-supabase-demo.netlify.app)
