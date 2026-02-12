import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "bbang.dev",
    pageTitleSuffix: " | bbang.dev",
    enableSPA: true,
    enablePopovers: false,
    analytics: {
      provider: "google",
      tagId: "G-BKNGY77L23",
    },
    locale: "ko-KR",
    baseUrl: "bbbang105.github.io",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "published",
    theme: {
      fontOrigin: "local",
      cdnCaching: false,
      typography: {
        header: "Pretendard Variable",
        body: "Pretendard Variable",
        code: "JetBrains Mono",
      },
      colors: {
        lightMode: {
          light: "#fafafa",
          lightgray: "#e5e7eb",
          gray: "#71717a",
          darkgray: "#27272a",
          dark: "#18181b",
          secondary: "#2563eb",
          tertiary: "#0ea5e9",
          highlight: "rgba(37, 99, 235, 0.08)",
          textHighlight: "rgba(14, 165, 233, 0.15)",
        },
        darkMode: {
          light: "#0a0a0b",
          lightgray: "#1a1a1d",
          gray: "#3f3f46",
          darkgray: "#d4d4d8",
          dark: "#fafafa",
          secondary: "#60a5fa",
          tertiary: "#38bdf8",
          highlight: "rgba(96, 165, 250, 0.1)",
          textHighlight: "rgba(56, 189, 248, 0.2)",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "tokyo-night",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.CoverImage(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // OG 이미지 플러그인 비활성화 (이모지 폴더명 호환 문제)
      // Plugin.CustomOgImages({
      //   colorScheme: "darkMode",
      //   fonts: [
      //     {
      //       name: "Noto Sans KR",
      //       weight: 700,
      //       style: "normal",
      //     },
      //   ],
      // }),
    ],
  },
}

export default config
