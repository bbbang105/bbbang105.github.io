import { QuartzEmitterPlugin } from "../types"
import { BuildCtx } from "../../util/ctx"
import { StaticResources } from "../../util/resources"

export const PWA: QuartzEmitterPlugin = () => ({
  name: "PWA",
  async emit() {
    return []
  },
  async *partialEmit() {},
  externalResources(_ctx: BuildCtx): Partial<StaticResources> {
    const cfg = _ctx.cfg.configuration
    const lightColor = cfg.theme.colors.lightMode.light
    const darkColor = cfg.theme.colors.darkMode.light

    return {
      additionalHead: [
        <meta name="theme-color" content={lightColor} media="(prefers-color-scheme: light)" />,
        <meta name="theme-color" content={darkColor} media="(prefers-color-scheme: dark)" />,
        <meta name="apple-mobile-web-app-capable" content="yes" />,
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />,
        <meta name="apple-mobile-web-app-title" content={cfg.pageTitle} />,
        <link rel="apple-touch-icon" href="/static/icon.png" />,
      ],
    }
  },
})
