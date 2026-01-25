import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/pageViews.scss"

const PageViews: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  const slug = fileData.slug ?? ""

  return (
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

PageViews.css = style

PageViews.afterDOMLoaded = `
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
      // GoatCounter API로 조회수 가져오기
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

// 페이지 로드 시 실행
updatePageViews()

// SPA 네비게이션 시 실행
document.addEventListener('nav', () => {
  updatePageViews()
})
`

export default (() => PageViews) satisfies QuartzComponentConstructor
