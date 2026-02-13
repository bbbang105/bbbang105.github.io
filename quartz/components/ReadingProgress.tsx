import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const ReadingProgress: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
  return (
    <div id="reading-progress-container" class={displayClass}>
      <div id="reading-progress-bar"></div>
    </div>
  )
}

ReadingProgress.css = `
#reading-progress-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  z-index: 999;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

#reading-progress-container.visible {
  opacity: 1;
}

#reading-progress-bar {
  height: 100%;
  width: 0%;
  background: var(--secondary);
  transition: width 0.1s ease-out;
}

@media (prefers-reduced-motion: reduce) {
  #reading-progress-bar {
    transition: none;
  }
}
`

ReadingProgress.afterDOMLoaded = `
document.addEventListener("nav", () => {
  const progressContainer = document.getElementById("reading-progress-container")
  const progressBar = document.getElementById("reading-progress-bar")

  if (!progressContainer || !progressBar) return

  // Check if we're on an article page (has <article> element)
  const articleElement = document.querySelector("article")

  if (!articleElement) {
    // Not an article page, hide progress bar
    progressContainer.classList.remove("visible")
    return
  }

  // Show progress bar on article pages
  progressContainer.classList.add("visible")

  let ticking = false

  function updateProgress() {
    // Calculate scroll progress
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight
    const scrollTop = window.scrollY || document.documentElement.scrollTop

    // Calculate progress percentage
    const scrollableHeight = documentHeight - windowHeight
    const progress = scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0

    // Update progress bar width
    progressBar.style.width = Math.min(progress, 100) + "%"

    ticking = false
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(updateProgress)
      ticking = true
    }
  }

  // Initial update
  updateProgress()

  // Listen to scroll events
  window.addEventListener("scroll", onScroll, { passive: true })

  // Cleanup function for SPA navigation
  window.addCleanup(() => {
    window.removeEventListener("scroll", onScroll)
    progressContainer.classList.remove("visible")
    progressBar.style.width = "0%"
  })
})
`

export default (() => ReadingProgress) satisfies QuartzComponentConstructor
