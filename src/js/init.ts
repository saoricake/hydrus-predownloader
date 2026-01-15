let latest = ""

document.addEventListener("keydown", async (ev) => {
  if (!isIllustPage()) return
  if (!ev.ctrlKey) return
  if (ev.key !== "q") return
  if (ev.repeat) return

  const dialog = getDialog()
  if (dialog.open) return

  if (latest !== location.pathname) {
    /** @todo update image list */
    latest = location.pathname
  }

  dialog.showModal()
})
