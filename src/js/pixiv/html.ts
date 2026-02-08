const ARTIST_ID_FIELD = "artist-id"
const ILLUST_DATE_FIELD = "illust-date"
const ARTIST_NAME_FIELD = "artist-name"
const TAGS_TEXTAREA = "tags"

const getDialog = (() => {
  const createDialogBase = () => {
    const dialog = document.createElement("dialog")
    const form = document.createElement("form")

    dialog.setAttribute("closedby", "any")
    dialog.id = "downloader"
    form.name = "downloader-form"

    dialog.appendChild(form)

    return { dialog, form }
  }

  const createHiddenInputs = () => {
    const artistIdInput = document.createElement("input")
    const illustDateInput = document.createElement("input")

    artistIdInput.type = "hidden"
    illustDateInput.type = "hidden"
    artistIdInput.name = ARTIST_ID_FIELD
    illustDateInput.name = ILLUST_DATE_FIELD

    return { artistIdInput, illustDateInput }
  }

  const createArtistNameField = (() => {
    const getArtistId = () => getInput(ARTIST_ID_FIELD).value

    const createHandlers = (input: HTMLInputElement) => ({
      save: () => {
        if (!input.value) return
        input.value = input.value.replaceAll(" ", "_").trim()
        localStorage.setItem(getArtistId(), input.value)
      },
      load: () => {
        const saved = localStorage.getItem(getArtistId())
        if (!saved) return
        input.value = saved
      },
      clear: () => localStorage.removeItem(getArtistId())
    })

    const createButton = (
      label: string,
      onClick: NonNullable<HTMLButtonElement["onclick"]>
    ) => {
      const button = document.createElement("button")
      button.appendChild(document.createTextNode(label))
      button.type = "button"
      button.addEventListener("click", onClick)
      return button
    }

    return () => {
      const label = document.createElement("label")
      const input = document.createElement("input")
      const { save, load, clear } = createHandlers(input)
      const saveButton = createButton("save", save)
      const loadButton = createButton("load", load)
      const clearButton = createButton("clear", clear)

      input.name = ARTIST_NAME_FIELD
      input.placeholder = "artist's name"
      input.type = "text"
      input.required = true

      label.appendChild(input)
      label.appendChild(saveButton)
      label.appendChild(loadButton)
      label.appendChild(clearButton)

      return label
    }
  })()

  const createTagTextarea = () => {
    const textarea = document.createElement("textarea")
    textarea.name = TAGS_TEXTAREA
    textarea.placeholder = "tags"
    textarea.wrap = "off"
    return textarea
  }

  const createImageList = () => {
    const fieldset = document.createElement("fieldset")
    fieldset.id = "imageList"
    fieldset.name = "images"
    return fieldset
  }

  const createDownloadButton = (() => {
    type Sidecar = {
      date: string
      artist: string
      tags?: string[]
    }

    const downloadLink = document.createElement("a")
    downloadLink.target = "_blank"

    const getSelectedImages = () => {
      const allImages = getInput("image") as RadioNodeList
      return Array.from(allImages).filter(i => i.checked)
    }

    const createSidecar = () => {
      const date = getInput(ILLUST_DATE_FIELD).value
      const artist = getInput(ARTIST_NAME_FIELD).value.trim()
      const tags = getInput(TAGS_TEXTAREA).value.trim()

      const sidecar: Sidecar = { date, artist }
      if (tags) { sidecar.tags = tags.split("\n").filter(t => t !== "") }

      return sidecar
    }

    const handleDownload = async (ev: PointerEvent) => {
      ev.preventDefault()

      const images = getSelectedImages()
      if (!images.length) return
      
      for (const img of images) {
        const imgBlob = await fetch(img.value).then(r => r.blob())
        downloadLink.href = URL.createObjectURL(imgBlob)
        const splitHref = img.value.split("/")
        downloadLink.download = splitHref[splitHref.length - 1]
        downloadLink.click()
      }

      const sidecar = createSidecar()
      const sidecarJSON = JSON.stringify(sidecar)
      downloadLink.href = `data:json,${sidecarJSON}`
      downloadLink.download = getImgId() + ".json"
      downloadLink.click()
    }

    return () => {
      /** @todo only enable the download button if at least one image was selected */
      const button = document.createElement("button")
      button.addEventListener("click", handleDownload)
      button.appendChild(document.createTextNode("download"))
      return button
    }
  })()

  const createDialog = () => {
    const { dialog, form } = createDialogBase()
    const { artistIdInput, illustDateInput } = createHiddenInputs()
    const section = document.createElement("section")

    form.appendChild(section)
    form.appendChild(createImageList())
    form.appendChild(artistIdInput)
    form.appendChild(illustDateInput)
    section.appendChild(createArtistNameField())
    section.appendChild(createTagTextarea())
    section.appendChild(createDownloadButton())

    document.body.appendChild(dialog)
    return dialog
  }

  return () => (
    document.getElementById("downloader") as HTMLDialogElement
    ?? createDialog()
  )
})()

const updateHiddenInputs = (() => {
  type IllustResponseBody = {
    createDate: string
    uploadDate: string
    userId: string
  }

  type HiddenInputs = {
    artistIdInput: HTMLInputElement
    illustDateInput: HTMLInputElement
  }

  const getDateAndUserId = () =>
    fetch(`${location.origin}/ajax/illust/${getImgId()}`)
      .then<{ body: IllustResponseBody }>(r => r.json())
      .then(j => j.body)

  const getHiddenInputs = (): HiddenInputs => {
    const form = document.forms.namedItem("downloader-form")!
    return {
      artistIdInput: form.elements.namedItem(ARTIST_ID_FIELD) as HTMLInputElement,
      illustDateInput: form.elements.namedItem(ILLUST_DATE_FIELD) as HTMLInputElement
    }
  }

  return async () => {
    const { createDate, userId } = await getDateAndUserId()
    const { artistIdInput, illustDateInput } = getHiddenInputs()

    artistIdInput.value = userId
    illustDateInput.value = createDate.split("T")[0]
  }
})()

const initArtistNameField = () => {
  const saved = localStorage.getItem(getInput(ARTIST_ID_FIELD).value)
  if (!saved) return
  getInput(ARTIST_NAME_FIELD).value = saved
}

const updateImageList = (() => {
  type ImgURLs = {
    url: string
    thumb: string
  }

  const IMG_SIZE = 128

  const createImgListItem = ({ url, thumb }: ImgURLs) => {
    const label = document.createElement("label")
    const input = document.createElement("input")
    const img = document.createElement("img")

    input.name = "image"
    input.type = "checkbox"
    input.value = url
    img.height = IMG_SIZE
    img.width = IMG_SIZE
    img.src = thumb

    label.appendChild(input)
    label.appendChild(img)

    return label
  }

  return (imgURLsArray: ImgURLs[]) => {
    const listItems = []

    for (const iu of imgURLsArray) {
      listItems.push(createImgListItem(iu))
    }

    const imgList = document.getElementById("imageList")!
    imgList.replaceChildren(...listItems)
  }
})()
