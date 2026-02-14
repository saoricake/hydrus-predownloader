const openDialog = (() => {
  let latest = ""

  return async (ev: KeyboardEvent) => {
    if (!isIllustPage()) return
    if (!ev.ctrlKey) return
    if (ev.key !== "q") return
    if (ev.repeat) return

    const dialog = getDialog()
    if (dialog.open) return

    if (latest !== location.pathname) {
      await initHiddenInputs()
      initArtistNameField()
      const imgURLs = await getImgURLs()
      initImageList(imgURLs)
      latest = location.pathname
    }

    dialog.showModal()
  }
})()

document.addEventListener("keydown", openDialog)
