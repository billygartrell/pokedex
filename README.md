# Original 150 Pokedex

A mobile-first static Pokedex for tracking caught Pokemon from the original Kanto 150.

## Features

- Original 150 Pokemon list
- Caught / missing tracking
- Search by name, number, or type
- All, caught, and missing filters
- Local browser persistence with `localStorage`
- Supabase cloud sync for one shared profile
- Netlify-ready static files

## Cloud Sync

The app syncs one shared profile named `main` to Supabase. Run `supabase-schema.sql` in your Supabase SQL editor before deploying.

## Local Preview

```sh
python3 -m http.server 5173
```

Then open `http://localhost:5173/`.

## Deploying to Netlify

Use these settings:

- Build command: leave blank
- Publish directory: `.`
