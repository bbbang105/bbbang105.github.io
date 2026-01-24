import { FullSlug, isFolderPath, resolveRelative } from "../util/path"
import { QuartzPluginData } from "../plugins/vfile"
import { Date, getDate } from "./Date"
import { QuartzComponent, QuartzComponentProps } from "./types"
import { GlobalConfiguration } from "../cfg"

export type SortFn = (f1: QuartzPluginData, f2: QuartzPluginData) => number

export function byDateAndAlphabetical(cfg: GlobalConfiguration): SortFn {
  return (f1, f2) => {
    // Sort by date/alphabetical
    if (f1.dates && f2.dates) {
      // sort descending
      return getDate(cfg, f2)!.getTime() - getDate(cfg, f1)!.getTime()
    } else if (f1.dates && !f2.dates) {
      // prioritize files with dates
      return -1
    } else if (!f1.dates && f2.dates) {
      return 1
    }

    // otherwise, sort lexographically by title
    const f1Title = f1.frontmatter?.title.toLowerCase() ?? ""
    const f2Title = f2.frontmatter?.title.toLowerCase() ?? ""
    return f1Title.localeCompare(f2Title)
  }
}

export function byDateAndAlphabeticalFolderFirst(cfg: GlobalConfiguration): SortFn {
  return (f1, f2) => {
    // Sort folders first
    const f1IsFolder = isFolderPath(f1.slug ?? "")
    const f2IsFolder = isFolderPath(f2.slug ?? "")
    if (f1IsFolder && !f2IsFolder) return -1
    if (!f1IsFolder && f2IsFolder) return 1

    // If both are folders or both are files, sort by date/alphabetical
    if (f1.dates && f2.dates) {
      // sort descending
      return getDate(cfg, f2)!.getTime() - getDate(cfg, f1)!.getTime()
    } else if (f1.dates && !f2.dates) {
      // prioritize files with dates
      return -1
    } else if (!f1.dates && f2.dates) {
      return 1
    }

    // 한국어 가나다순 정렬 (이모지 제거 후)
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

  return (
    <ul class="section-ul">
      {list.map((page) => {
        const title = page.frontmatter?.title
        const tags = page.frontmatter?.tags ?? []
        const coverImage = page.coverImage
        const isFolder = isFolderPath(page.slug ?? "")

        return (
          <li class="section-li">
            {isFolder ? (
              <a href={resolveRelative(fileData.slug!, page.slug!)} class="internal section-folder">
                <span class="folder-icon">📁</span>
                <span class="folder-title">{title}</span>
              </a>
            ) : (
            <a href={resolveRelative(fileData.slug!, page.slug!)} class="internal post-card">
              <div class="post-meta">
                {page.dates && <Date date={getDate(cfg, page)!} locale={cfg.locale} />}
                {tags.length > 0 && (
                  <span class="post-tags">
                    {tags.slice(0, 2).map((tag) => (
                      <span class="tag">{tag}</span>
                    ))}
                  </span>
                )}
              </div>
              <h3 class="post-title">{title}</h3>
            </a>
            )}
          </li>
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
  margin-bottom: 0;
}

/* 포스트 카드 - 미니멀 스타일 */
.post-card {
  display: block;
  padding: 1rem 0;
  border-bottom: 1px solid var(--lightgray);
  text-decoration: none;
  transition: opacity 0.2s ease;
}

.post-card:hover {
  opacity: 0.7;
}

.section-li:last-child .post-card {
  border-bottom: none;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.4rem;
  font-size: 0.85rem;
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
  font-size: 0.8rem;
}

.post-tags .tag::before {
  content: "#";
}

.post-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--dark);
  line-height: 1.4;
}

/* 폴더 스타일 */
.section-folder {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.8rem 1rem;
  margin-bottom: 0.5rem;
  background: var(--lightgray);
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.section-folder:hover {
  background: var(--highlight);
  transform: translateX(4px);
}

.section-folder .folder-icon {
  font-size: 1.2rem;
}

.section-folder .folder-title {
  font-size: 1rem;
  font-weight: 500;
  color: var(--dark);
}

/* 모바일 */
@media (max-width: 650px) {
  .post-card {
    padding: 0.8rem 0;
  }

  .post-title {
    font-size: 1rem;
  }

  .post-meta {
    font-size: 0.8rem;
    flex-wrap: wrap;
  }

  .section-folder {
    padding: 0.6rem 0.8rem;
  }
}
`
