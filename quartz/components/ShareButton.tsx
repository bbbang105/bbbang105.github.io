import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const ShareButton: QuartzComponent = ({ fileData, cfg }: QuartzComponentProps) => {
  const url = `https://${cfg.baseUrl}/${fileData.slug}`

  return (
    <button
      class="share-button"
      data-url={url}
      aria-label="링크 복사"
      title="링크 복사"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <polyline points="16 6 12 2 8 6" />
        <line x1="12" y1="2" x2="12" y2="15" />
      </svg>
      <span class="share-text">공유</span>
    </button>
  )
}

ShareButton.css = `
.share-button {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.8rem;
  border: 1px solid var(--lightgray);
  border-radius: 6px;
  background: transparent;
  color: var(--darkgray);
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.share-button:hover {
  border-color: var(--secondary);
  color: var(--secondary);
}

.share-button.copied {
  border-color: var(--tertiary);
  color: var(--tertiary);
}

.share-button .share-text {
  font-family: var(--bodyFont);
}
`

ShareButton.afterDOMLoaded = `
document.querySelectorAll('.share-button').forEach(button => {
  button.addEventListener('click', async () => {
    const url = button.getAttribute('data-url')
    try {
      await navigator.clipboard.writeText(url)
      button.classList.add('copied')
      button.querySelector('.share-text').textContent = '복사됨!'
      setTimeout(() => {
        button.classList.remove('copied')
        button.querySelector('.share-text').textContent = '공유'
      }, 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  })
})
`

export default (() => ShareButton) satisfies QuartzComponentConstructor
