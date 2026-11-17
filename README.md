# EVEE FLIX

EVEE FLIX is a movie and series discovery app built with React and Vite.

## Features
- Trending movies and series from TMDB
- Search across movies and TV series
- Movie and series details
- Streaming-provider availability by region when supplied by TMDB
- Personal watchlist stored in the browser
- Responsive dark EVEE interface

## Run locally
```bash
npm install
npm run dev
```

## Connect the live catalogue
1. Create a TMDB account and request a developer API Read Access Token from the API settings.
2. In Vercel, open the project settings and add an environment variable named `TMDB_API_READ_ACCESS_TOKEN`.
3. Paste the token as its value. Do not put it in frontend code or commit it to GitHub.
4. Redeploy the project. The app will then load live catalogue data through the `/api/tmdb` serverless function.

For local development, use Vercel's local development command so the `/api` function is available.

TMDB attribution is required for non-commercial developer API use. Add the approved TMDB logo and this notice in the app's About/Credits section:
"This product uses the TMDB API but is not endorsed or certified by TMDB."

## Important
EVEE FLIX is a discovery interface, not a source of free copyrighted streams. Provider availability is informational and varies by country. Playback and offline downloads must use official provider integrations and content for which EVEE has the necessary rights. TMDB data does not grant streaming rights.
