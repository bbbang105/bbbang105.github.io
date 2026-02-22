# PWA Design - Home Screen Install Only

## Goal

Enable "Add to Home Screen" on mobile/desktop without offline caching.

## Architecture

Single new emitter plugin: `quartz/plugins/emitters/pwa.ts`

### Emitted Files

1. **`public/manifest.webmanifest`** - Web App Manifest
2. **`public/sw.js`** - Minimal service worker (install condition only)

### Head Injection (via `externalResources`)

- `<link rel="manifest" href="/manifest.webmanifest">`
- `<meta name="theme-color">` (light/dark)
- `<meta name="apple-mobile-web-app-capable">`
- `<meta name="apple-mobile-web-app-status-bar-style">`
- `<link rel="apple-touch-icon">` (iOS)
- SW registration `<script>` with `data-persist`

### Icons

- Existing `icon.png` (512x512) reused
- Generate `icon-192.png` (192x192) via `sips`
- Both placed in `quartz/static/`

### Registration

- `quartz.config.ts` emitters array에 `Plugin.PWA()` 추가

## Decisions

- No offline caching (user requested install-only)
- No push notifications
- display: standalone
- theme-color: lightMode `#fafafa`, darkMode `#0a0a0b` (from config)
