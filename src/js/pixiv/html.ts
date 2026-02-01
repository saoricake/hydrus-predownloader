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

  const createArtistNameField = (() => {
    const getArtistId = () => getInput("artist-id").value

    const createHandlers = (input: HTMLInputElement) => ({
      save: () => {
        if (!input.value) return
        input.value = input.value.replaceAll(" ", "_")
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

      input.name = "artist-name"
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

  const createHiddenInputs = () => {
    const artistIdInput = document.createElement("input")
    const illustDateInput = document.createElement("input")

    artistIdInput.type = "hidden"
    illustDateInput.type = "hidden"
    artistIdInput.name = "artist-id"
    illustDateInput.name = "illust-date"

    return { artistIdInput, illustDateInput }
  }

  const createImageList = () => {
    const fieldset = document.createElement("fieldset")
    fieldset.id = "imageList"
    fieldset.name = "images"
    return fieldset
  }

  const createDialog = () => {
    const { dialog, form } = createDialogBase()
    const { artistIdInput, illustDateInput } = createHiddenInputs()
    const section = document.createElement("section")

    form.appendChild(section)
    form.appendChild(createImageList())
    form.appendChild(artistIdInput)
    form.appendChild(illustDateInput)
    section.appendChild(createArtistNameField())

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
      artistIdInput: form.elements.namedItem("artist-id") as HTMLInputElement,
      illustDateInput: form.elements.namedItem("illust-date") as HTMLInputElement
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
  const saved = localStorage.getItem(getInput("artist-id").value)
  if (!saved) return
  getInput("artist-name").value = saved
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
