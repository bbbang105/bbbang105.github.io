import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { resolveRelative, isFolderPath } from "../util/path"
import { QuartzPluginData } from "../plugins/vfile"
import { Date, getDate } from "./Date"
import style from "./styles/relatedPosts.scss"
import { classNames } from "../util/lang"

interface Options {
  title?: string
  limit: number
}

const defaultOptions: Options = {
  title: "관련 글",
  limit: 3,
}

interface ScoredPost {
  page: QuartzPluginData
  score: number
}

function calculateRelatedScore(
  currentPage: QuartzPluginData,
  candidatePage: QuartzPluginData,
): number {
  let score = 0

  // Get tags from both pages
  const currentTags = (currentPage.frontmatter?.tags ?? []) as string[]
  const candidateTags = (candidatePage.frontmatter?.tags ?? []) as string[]

  // Calculate shared tags (+2 points per shared tag)
  const sharedTags = currentTags.filter((tag) => candidateTags.includes(tag))
  score += sharedTags.length * 2

  return score
}

export default ((userOpts?: Partial<Options>) => {
  const RelatedPosts: QuartzComponent = ({
    allFiles,
    fileData,
    displayClass,
    cfg,
  }: QuartzComponentProps) => {
    const opts = { ...defaultOptions, ...userOpts }

    // Only show on single content pages (not folders, not index)
    if (isFolderPath(fileData.slug ?? "") || fileData.slug === "index") {
      return null
    }

    // Filter out current page and folder paths
    const currentSlug = fileData.slug!
    const candidatePages = allFiles.filter(
      (page) => page.slug !== currentSlug && !isFolderPath(page.slug ?? ""),
    )

    // Calculate scores for all candidate pages
    const scoredPages: ScoredPost[] = candidatePages
      .map((page) => ({
        page,
        score: calculateRelatedScore(fileData, page),
      }))
      .filter((scored) => scored.score > 0) // Only show posts with score > 0

    // Sort by score descending, then by date descending as tiebreaker
    scoredPages.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score
      }

      // Tiebreaker: sort by date
      const dateA = getDate(cfg, a.page)
      const dateB = getDate(cfg, b.page)

      if (dateA && dateB) {
        return dateB.getTime() - dateA.getTime()
      } else if (dateA && !dateB) {
        return -1
      } else if (!dateA && dateB) {
        return 1
      }

      return 0
    })

    const relatedPosts = scoredPages.slice(0, opts.limit)

    // Don't render if no related posts
    if (relatedPosts.length === 0) {
      return null
    }

    return (
      <div class={classNames(displayClass, "related-posts")}>
        <h3>{opts.title}</h3>
        <ul class="related-list">
          {relatedPosts.map(({ page }) => {
            const title = page.frontmatter?.title ?? "Untitled"
            const tags = (page.frontmatter?.tags ?? []) as string[]
            const date = getDate(cfg, page)

            return (
              <li class="related-item">
                <a href={resolveRelative(fileData.slug!, page.slug!)} class="internal">
                  <h4 class="related-title">{title}</h4>
                  <div class="related-meta">
                    {date && (
                      <span class="related-date">
                        <Date date={date} locale={cfg.locale} />
                      </span>
                    )}
                    {tags.length > 0 && (
                      <span class="related-tags">
                        {tags.slice(0, 2).map((tag) => (
                          <span class="tag">#{tag}</span>
                        ))}
                      </span>
                    )}
                  </div>
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  RelatedPosts.css = style
  return RelatedPosts
}) satisfies QuartzComponentConstructor
