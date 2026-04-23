# Stack Beam

Kleines Puzzle-Spiel im Browser: Du platzierst Blöcke auf dem 16x16-Feld und schießt Strahlen vom Rand ab, bis das erzeugte Farbbild exakt zum Zielbild passt.

## Lokal starten

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Der statische Output liegt danach in `docs/games/stack-beam/`.

## Statisch hosten

Den Inhalt von `docs/games/stack-beam/` auf einen beliebigen Static Host legen, zum Beispiel:

- GitHub Pages
- Netlify
- Vercel
- Azure Static Web Apps

Wichtig ist nur, dass `index.html` als Einstieg ausgeliefert wird.

## Hintergrundmusik (MP3)

MP3-Dateien kommen nach `public/audio/`.

Trackliste in `public/audio/tracks.json`, Beispiel:

```json
[
  { "title": "Main Theme", "src": "/audio/main-theme.mp3" },
  { "title": "Night Loop", "src": "/audio/night-loop.mp3" }
]
```
