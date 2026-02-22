import { QuartzEmitterPlugin } from "../types"
import { write } from "./helpers"
import { FullSlug } from "../../util/path"
import { BuildCtx } from "../../util/ctx"
import { StaticResources } from "../../util/resources"

export const PWA: QuartzEmitterPlugin = () => ({
  name: "PWA",
  async emit(ctx) {
    const cfg = ctx.cfg.configuration
    const baseUrl = cfg.baseUrl ?? ""
    const lightColor = cfg.theme.colors.lightMode.light
    const darkColor = cfg.theme.colors.darkMode.light

    const manifest = JSON.stringify(
      {
        name: cfg.pageTitle,
        short_name: cfg.pageTitle,
        start_url: "/",
        display: "standalone",
        background_color: lightColor,
        theme_color: lightColor,
        icons: [
          {
            src: "/static/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/static/icon.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      null,
      2,
    )

    const sw = `// Minimal service worker for PWA installability
self.addEventListener("install", (e) => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
`

    const paths = await Promise.all([
      write({
        ctx,
        content: manifest,
        slug: "manifest" as FullSlug,
        ext: ".webmanifest",
      }),
      write({
        ctx,
        content: sw,
        slug: "sw" as FullSlug,
        ext: ".js",
      }),
    ])

    return paths
  },
  async *partialEmit() {},
  externalResources(_ctx: BuildCtx): Partial<StaticResources> {
    const cfg = _ctx.cfg.configuration
    const lightColor = cfg.theme.colors.lightMode.light
    const darkColor = cfg.theme.colors.darkMode.light

    return {
      additionalHead: [
        <link rel="manifest" href="/manifest.webmanifest" data-persist />,
        <meta name="theme-color" content={lightColor} media="(prefers-color-scheme: light)" />,
        <meta name="theme-color" content={darkColor} media="(prefers-color-scheme: dark)" />,
        <meta name="apple-mobile-web-app-capable" content="yes" />,
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />,
        <meta name="apple-mobile-web-app-title" content={cfg.pageTitle} />,
        <link rel="apple-touch-icon" href="/static/icon.png" />,
        <script
          data-persist
          dangerouslySetInnerHTML={{
            __html: `if("serviceWorker"in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("/sw.js"))`,
          }}
        />,
      ],
    }
  },
})
