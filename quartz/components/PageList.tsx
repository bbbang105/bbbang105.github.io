import { isFolderPath, resolveRelative } from "../util/path"
import { QuartzPluginData } from "../plugins/vfile"
import { Date as DateComponent, getDate } from "./Date"
import { QuartzComponent, QuartzComponentProps } from "./types"
import { GlobalConfiguration } from "../cfg"

export type SortFn = (f1: QuartzPluginData, f2: QuartzPluginData) => number

function getDateValue(f: QuartzPluginData): number {
  const dateStr = f.frontmatter?.date
  if (dateStr && typeof dateStr === 'string') {
    const d = new Date(dateStr)
    return isNaN(d.getTime()) ? 0 : d.getTime()
  }
  return 0
}

export function byDateAndAlphabetical(_cfg: GlobalConfiguration): SortFn {
  return (f1, f2) => {
    const f1Time = getDateValue(f1)
    const f2Time = getDateValue(f2)

    if (f1Time && f2Time) {
      return f2Time - f1Time
    } else if (f1Time && !f2Time) {
      return -1
    } else if (!f1Time && f2Time) {
      return 1
    }

    // 날짜 없으면 가나다순
    const f1Title = f1.frontmatter?.title?.toLowerCase() ?? ""
    const f2Title = f2.frontmatter?.title?.toLowerCase() ?? ""
    return f1Title.localeCompare(f2Title)
  }
}

export function byDateAndAlphabeticalFolderFirst(_cfg: GlobalConfiguration): SortFn {
  return (f1, f2) => {
    // Sort folders first
    const f1IsFolder = isFolderPath(f1.slug ?? "")
    const f2IsFolder = isFolderPath(f2.slug ?? "")
    if (f1IsFolder && !f2IsFolder) return -1
    if (!f1IsFolder && f2IsFolder) return 1

    const f1Time = getDateValue(f1)
    const f2Time = getDateValue(f2)

    if (f1Time && f2Time) {
      return f2Time - f1Time
    } else if (f1Time && !f2Time) {
      return -1
    } else if (!f1Time && f2Time) {
      return 1
    }

    // 날짜 없으면 가나다순
    const f1Title = (f1.frontmatter?.title ?? "").replace(/^[^\p{L}\p{N}]+/u, "")
    const f2Title = (f2.frontmatter?.title ?? "").replace(/^[^\p{L}\p{N}]+/u, "")
    return f1Title.localeCompare(f2Title, "ko", { numeric: true, sensitivity: "base" })
  }
}

type Props = {
  limit?: number
  sort?: SortFn
} & QuartzComponentProps

export const PageList: QuartzComponent = ({ cfg, fileData, allFiles, limit, sort }: Props) => {
  const sorter = sort ?? byDateAndAlphabeticalFolderFirst(cfg)
  let list = allFiles.sort(sorter)
  if (limit) {
    list = list.slice(0, limit)
  }

  let lastYear: number | null = null

  return (
    <ul class="section-ul">
      {list.map((page) => {
        const title = page.frontmatter?.title
        const tags = page.frontmatter?.tags ?? []
        const coverImage = page.coverImage
        const description = page.frontmatter?.description ?? page.description
        const isFolder = isFolderPath(page.slug ?? "")
        const fileCount = (page as any).fileCount

        // 연도별 구분선
        const date = getDate(cfg, page)
        const year = date ? new Date(date).getFullYear() : null
        let yearDivider = null
        if (year && year !== lastYear && !isFolder) {
          lastYear = year
          yearDivider = (
            <li class="year-divider">
              <span class="year-label">{year}년</span>
            </li>
          )
        }

        return (
          <>
            {yearDivider}
            <li class="section-li">
              {isFolder ? (
                <a href={resolveRelative(fileData.slug!, page.slug!)} class="internal section-folder">
                  <h3 class="folder-title">{title}</h3>
                  {fileCount !== undefined && <span class="folder-count">{fileCount}개의 글</span>}
                </a>
              ) : (
                <a href={resolveRelative(fileData.slug!, page.slug!)} class="internal post-card">
                  <div class={coverImage ? "post-card-with-thumb" : ""}>
                    <div class="post-card-content">
                      <div class="post-meta">
                        {date && <DateComponent date={date} locale={cfg.locale} />}
                        {tags.length > 0 && (
                          <span class="post-tags">
                            {tags.slice(0, 3).map((tag) => (
                              <span class="tag">{tag}</span>
                            ))}
                          </span>
                        )}
                      </div>
                      <h3 class="post-title">{title}</h3>
                      {description && (
                        <p class="post-description">{
                          typeof description === 'string' && description.length > 120
                            ? description.slice(0, 120) + "..."
                            : description
                        }</p>
                      )}
                    </div>
                    {coverImage && (
                      <img
                        class="post-thumbnail"
                        src={coverImage}
                        alt={title ? `${title} 썸네일` : "포스트 썸네일"}
                        loading="lazy"
                        decoding="async"
                      />
                    )}
                  </div>
                </a>
              )}
            </li>
          </>
        )
      })}
    </ul>
  )
}

PageList.css = `
.section-ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.section-li {
  margin-bottom: 1rem;
}

/* 포스트 카드 - shadcn 스타일 */
.post-card {
  display: block;
  padding: 1.5rem 1.75rem;
  background-color: transparent !important;
  text-decoration: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid var(--lightgray);
  border-radius: 0.75rem;
}

.post-card:hover {
  border-color: var(--secondary);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
  transform: translateY(-1px);
}

.post-card:hover .post-title {
  color: var(--secondary);
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.4rem;
  font-size: 0.82rem;
  color: var(--gray);
}

.post-meta time {
  color: var(--gray);
}

.post-tags {
  display: flex;
  gap: 0.4rem;
}

.post-tags .tag {
  color: var(--secondary);
  font-size: 0.75rem;
  font-weight: 500;
}

.post-tags .tag::before {
  content: "#";
}

.post-title {
  margin: 0 0 0.15rem 0;
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--dark);
  line-height: 1.4;
  transition: color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 폴더 스타일 - shadcn 카드 */
.section-folder {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  background: transparent !important;
  text-decoration: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid var(--lightgray);
  border-radius: 0.75rem;
}

.section-folder:hover {
  border-color: var(--secondary);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
  transform: translateY(-1px);
}

.section-folder .folder-title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--dark);
  line-height: 1.4;
}

.section-folder:hover .folder-title {
  color: var(--secondary);
}

.section-folder .folder-count {
  font-size: 0.82rem;
  color: var(--gray);
  flex-shrink: 0;
}

/* 모바일 */
@media (max-width: 650px) {
  .post-card {
    padding: 1.25rem;
  }

  .post-title {
    font-size: 0.95rem;
  }

  .post-meta {
    font-size: 0.78rem;
    flex-wrap: wrap;
  }

  .section-folder {
    padding: 1rem;
  }

  .section-folder .folder-title {
    font-size: 0.95rem;
  }
}
`
