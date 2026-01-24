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
      tagId: "",
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
          light: "#f0f7ff",
          lightgray: "#d0e3f7",
          gray: "#8ba4c4",
          darkgray: "#3d5a80",
          dark: "#1b3a5f",
          secondary: "#3a86c4",
          tertiary: "#5cc8d4",
          highlight: "rgba(58, 134, 196, 0.1)",
          textHighlight: "rgba(92, 200, 212, 0.3)",
        },
        darkMode: {
          light: "#0d1117",
          lightgray: "#161b22",
          gray: "#30363d",
          darkgray: "#c9d1d9",
          dark: "#f0f6fc",
          secondary: "#58a6ff",
          tertiary: "#5ce1e6",
          highlight: "rgba(88, 166, 255, 0.15)",
          textHighlight: "rgba(92, 225, 230, 0.3)",
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
