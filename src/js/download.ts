type Sidecar = {
  date: number
  url: string
  tags: string[]
}

const handleDownload = (() => {
  const link = document.createElement("a")
  link.target = "_blank"

  const cleanTags = (inputValue: string) =>
    inputValue.split("\n").map(t => t.trim()).filter(t => t !== "")

  const getSelectedImages = () => {
    const inputs = getInput<RadioNodeList | HTMLInputElement>(IMAGE_CHECKBOX)

    if ((inputs as RadioNodeList).length) {
      return Array.from(getInput<RadioNodeList>(IMAGE_CHECKBOX))
        .filter(i => i.checked)
        .map(i => i.value)
    } else {
      return (inputs as HTMLInputElement).checked ? [inputs.value] : []
    }
  }

  const createSidecar = (pageNum: number) => {
    const date = getInput(ILLUST_DATE_FIELD).value
    const artist = getInput(ARTIST_NAME_FIELD).value
    const seriesTags = getInput(SERIES_TAGS_TEXTAREA).value
    const charTags = getInput(CHARACTER_TAGS_TEXTAREA).value
    const tags = getInput(TAGS_TEXTAREA).value.trim()
    const addPageTags = getInput(PAGE_TAGS_CHECKBOX).checked

    const sidecar: Sidecar = {
      date: Temporal.Instant.from(date).epochMilliseconds / 1000,
      tags: [
        `creator:${artist}`,
        ...cleanTags(seriesTags).map(s => `series:${s}`),
        ...cleanTags(charTags).map(c => `character:${c}`),
        ...cleanTags(tags)
      ],
      url: getImgSource()
    }

    if (addPageTags) {
      sidecar.tags.push(`page:${pageNum}`)
    }

    return sidecar
  }

  return async (ev: SubmitEvent) => {
    ev.preventDefault()

    const images = getSelectedImages()
    if (!images.length) return

    for (let i = 0; i <= images.length; i++) {
      const href = images[i]
      const imgBlob = await fetch(href).then(r => r.blob())
      const splitHref = href.split("/")

      link.href = URL.createObjectURL(imgBlob)
      link.download = splitHref[splitHref.length - 1]
      link.click()
      URL.revokeObjectURL(link.href)

      const sidecar = createSidecar(i + 1)
      link.href = `data:json,${JSON.stringify(sidecar)}`
      link.download = link.download.split(".")[0] + ".json"
      link.click()
    }
  }
})()
