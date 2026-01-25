import { Date, getDate } from "./Date"
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import readingTime from "reading-time"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"
import { JSX } from "preact"
import style from "./styles/contentMeta.scss"

interface ContentMetaOptions {
  /**
   * Whether to display reading time
   */
  showReadingTime: boolean
  showComma: boolean
  showPageViews: boolean
}

const defaultOptions: ContentMetaOptions = {
  showReadingTime: true,
  showComma: true,
  showPageViews: true,
}

export default ((opts?: Partial<ContentMetaOptions>) => {
  // Merge options with defaults
  const options: ContentMetaOptions = { ...defaultOptions, ...opts }

  function ContentMetadata({ cfg, fileData, displayClass }: QuartzComponentProps) {
    const text = fileData.text
    const slug = fileData.slug ?? ""

    if (text) {
      const segments: (string | JSX.Element)[] = []

      if (fileData.dates) {
        segments.push(<Date date={getDate(cfg, fileData)!} locale={cfg.locale} />)
      }

      // Display reading time if enabled
      if (options.showReadingTime) {
        const { minutes, words: _words } = readingTime(text)
        const displayedTime = i18n(cfg.locale).components.contentMeta.readingTime({
          minutes: Math.ceil(minutes),
        })
        segments.push(<span>{displayedTime}</span>)
      }

      // Display page views if enabled
      if (options.showPageViews) {
        segments.push(
          <span class="page-views" data-slug={slug}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <span class="view-count">-</span>
          </span>
        )
      }

      return (
        <p show-comma={options.showComma} class={classNames(displayClass, "content-meta")}>
          {segments}
        </p>
      )
    } else {
      return null
    }
  }

  ContentMetadata.css = style

  ContentMetadata.afterDOMLoaded = `
const goatCounterCode = "bbangdev"

// GoatCounter 스크립트 로드
if (!window.goatcounter) {
  const script = document.createElement('script')
  script.src = '//gc.zgo.at/count.js'
  script.async = true
  script.dataset.goatcounter = 'https://' + goatCounterCode + '.goatcounter.com/count'
  document.head.appendChild(script)
}

async function updatePageViews() {
  const viewElements = document.querySelectorAll('.page-views')

  for (const el of viewElements) {
    const slug = el.getAttribute('data-slug')
    if (!slug) continue

    const countEl = el.querySelector('.view-count')
    if (!countEl) continue

    try {
      const path = slug === 'index' ? '/' : '/' + slug
      const response = await fetch(
        'https://' + goatCounterCode + '.goatcounter.com/counter/' + encodeURIComponent(path) + '.json'
      )

      if (response.ok) {
        const data = await response.json()
        countEl.textContent = data.count_unique || data.count || '0'
      } else {
        countEl.textContent = '0'
      }
    } catch (e) {
      countEl.textContent = '0'
    }
  }
}

updatePageViews()
document.addEventListener('nav', () => updatePageViews())
`

  return ContentMetadata
}) satisfies QuartzComponentConstructor
