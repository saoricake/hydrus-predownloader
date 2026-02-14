type Sidecar = {
  date: string
  artist: string
  tags?: string[]
}

const handleDownload = (() => {
  const link = document.createElement("a")
  link.target = "_blank"

  const getSelectedImages = () =>
    Array.from(getInput<RadioNodeList>(IMAGE_CHECKBOX))
      .filter(i => i.checked)
      .map(i => i.value)

  const createSidecar = () => {
    const date = getInput(ILLUST_DATE_FIELD).value
    const artist = getInput(ARTIST_NAME_FIELD).value
    const tags = getInput(TAGS_TEXTAREA).value.trim()

    const sidecar: Sidecar = { date, artist }
    if (tags) { sidecar.tags = tags.split("\n").filter(t => t !== "") }

    return sidecar
  }

  return async (ev: SubmitEvent) => {
    ev.preventDefault()

    const images = getSelectedImages()
    if (!images.length) return

    for (const href of images) {
      const imgBlob = await fetch(href).then(r => r.blob())
      const splitHref = href.split("/")

      link.href = URL.createObjectURL(imgBlob)
      link.download = splitHref[splitHref.length - 1]
      link.click()
      URL.revokeObjectURL(link.href)
    }

    const sidecar = createSidecar()
    link.href = `data:json,${JSON.stringify(sidecar)}`
    link.download = getImgId() + ".json"
    link.click()
  }
})()
