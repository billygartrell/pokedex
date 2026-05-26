# Scarlet & Violet Pokedex

A mobile-first static Pokedex for tracking caught Pokemon from the Scarlet and Violet Paldea Pokedex.

## Features

- 400 Pokemon from the Paldea Pokedex
- Separate caught / missing tracking for Billy and John
- Cross-check labels on each card to see the other trainer's status
- Search by name, number, or type
- All, caught, and missing filters
- Trainer-colored card states with small Billy / John ownership markers
- Per-trainer Scarlet and Violet story milestone tracking
- Local browser persistence with `localStorage`
- Supabase cloud sync for each trainer profile
- Netlify-ready static files

## Cloud Sync

The app syncs trainer profiles named `billy` and `friend` to Supabase. The `friend` profile is shown as John in the app. Run `supabase-schema.sql` in your Supabase SQL editor before deploying. The schema includes both the caught-list profile table and the catching journal table. If you ran an older version of the schema, run it again so Paldea Pokemon IDs are accepted by the journal.

## Local Preview

```sh
python3 -m http.server 5173
```

Then open `http://localhost:5173/`.

## Deploying to Netlify

Use these settings:

- Build command: leave blank
- Publish directory: `.`
