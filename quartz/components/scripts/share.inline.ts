document.addEventListener("nav", () => {
  const shareBtn = document.querySelector(".share-button") as HTMLButtonElement | null
  if (!shareBtn) return

  function onClick() {
    const url = window.location.href
    navigator.clipboard.writeText(url).then(() => {
      const toast = document.createElement("div")
      toast.className = "share-toast"
      toast.textContent = shareBtn!.dataset.copiedText || "복사되었습니다!"
      document.body.appendChild(toast)

      setTimeout(() => {
        toast.classList.add("show")
      }, 10)

      setTimeout(() => {
        toast.classList.remove("show")
        setTimeout(() => toast.remove(), 300)
      }, 2000)
    })
  }

  shareBtn.addEventListener("click", onClick)
  window.addCleanup(() => shareBtn.removeEventListener("click", onClick))
})
