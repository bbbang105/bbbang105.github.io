import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const ShareButton: QuartzComponent = ({ fileData, cfg }: QuartzComponentProps) => {
  const url = `https://${cfg.baseUrl}/${fileData.slug}`

  return (
    <>
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
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
      </button>
      <div class="toast" id="copy-toast">링크가 복사되었습니다</div>
    </>
  )
}

ShareButton.css = `
.share-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: var(--lightgray);
  color: var(--darkgray);
  cursor: pointer;
  transition: all 0.2s ease;
}

.share-button:hover {
  background: var(--secondary);
  color: var(--light);
  transform: scale(1.1);
}

.share-button:active {
  transform: scale(0.95);
}

/* 토스트 알림 */
.toast {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%) translateY(100px);
  background: var(--dark);
  color: var(--light);
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-family: var(--bodyFont);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 9999;
}

.toast.show {
  transform: translateX(-50%) translateY(0);
  opacity: 1;
  visibility: visible;
}
`

ShareButton.afterDOMLoaded = `
document.querySelectorAll('.share-button').forEach(button => {
  button.addEventListener('click', async () => {
    const url = button.getAttribute('data-url')
    const toast = document.getElementById('copy-toast')
    try {
      await navigator.clipboard.writeText(url)
      toast.classList.add('show')
      setTimeout(() => {
        toast.classList.remove('show')
      }, 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  })
})
`

export default (() => ShareButton) satisfies QuartzComponentConstructor
