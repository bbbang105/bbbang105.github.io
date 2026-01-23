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

    // otherwise, sort lexographically by title
    const f1Title = f1.frontmatter?.title.toLowerCase() ?? ""
    const f2Title = f2.frontmatter?.title.toLowerCase() ?? ""
    return f1Title.localeCompare(f2Title)
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
              <a href={resolveRelative(fileData.slug!, page.slug!)} class="internal section section-folder">
                <div class="folder-icon">
                  <span>📁</span>
                </div>
                <div class="content">
                  <div class="desc">
                    <h3>{title}</h3>
                  </div>
                </div>
              </a>
            ) : (
            <div class="section">
              <div class="thumbnail">
                <a href={resolveRelative(fileData.slug!, page.slug!)} class="internal">
                  {coverImage ? (
                    <img src={coverImage} alt={title} loading="lazy" />
                  ) : (
                    <span class="thumbnail-default">🧑🏻‍💻</span>
                  )}
                </a>
              </div>
              <div class="content">
                <p class="meta">
                  {page.dates && <Date date={getDate(cfg, page)!} locale={cfg.locale} />}
                </p>
                <div class="desc">
                  <h3>
                    <a href={resolveRelative(fileData.slug!, page.slug!)} class="internal">
                      {title}
                    </a>
                  </h3>
                </div>
                <ul class="tags">
                  {tags.map((tag) => (
                    <li>
                      <a
                        class="internal tag-link"
                        href={resolveRelative(fileData.slug!, `tags/${tag}` as FullSlug)}
                      >
                        {tag}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}

PageList.css = `
.section-li {
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid var(--lightgray);
}

.section-li:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.section {
  display: flex;
  gap: 1.2rem;
  align-items: flex-start;
}

.section h3 {
  margin: 0;
}

.section > .tags {
  margin: 0;
}

.section .thumbnail {
  flex-shrink: 0;
  width: 192px;
  height: 108px;
  border-radius: 8px;
  overflow: hidden;
  background: var(--lightgray);
  display: flex;
  align-items: center;
  justify-content: center;
}

.section .thumbnail img {
  display: block;
  width: 192px;
  height: 108px;
  object-fit: cover;
  object-position: center;
  transition: transform 0.2s ease;
}

.section .thumbnail a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  line-height: 0;
}

.section .thumbnail .thumbnail-default {
  font-size: 3rem;
  line-height: 1;
}

.section .thumbnail:hover img {
  transform: scale(1.05);
}


.section .content {
  flex: 1;
  min-width: 0;
}

.section .content h3 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 폴더 스타일 */
a.section-folder {
  text-decoration: none;
  color: inherit;
}

.section-folder {
  align-items: center;
  padding: 0.8rem 1rem;
  background: var(--lightgray);
  border-radius: 8px;
  transition: background 0.2s ease;
  cursor: pointer;
}

.section-folder:hover {
  background: var(--highlight);
}

.section-folder .folder-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
}

.section-folder .content h3 {
  font-size: 1.1rem;
}

@media (max-width: 600px) {
  .section {
    flex-direction: column;
  }

  .section .thumbnail {
    width: 100%;
    height: auto;
    aspect-ratio: 16 / 9;
  }

  .section .thumbnail img {
    width: 100%;
    height: 100%;
  }

  .section-folder {
    flex-direction: row;
  }
}
`
