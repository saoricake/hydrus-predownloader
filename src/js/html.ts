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

  const createButton = (
    label: string,
    onClick?: NonNullable<HTMLButtonElement["onclick"]>
  ) => {
    const button = document.createElement("button")
    button.appendChild(document.createTextNode(label))
    button.type = "button"
    if (onClick) button.addEventListener("click", onClick)
    return button
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

  const createTagsTextareas = (() => {
    const textarea = (name:string, placeholder: string) =>
      element("textarea", { name, placeholder, wrap: "off" })

    const createSeriesTagsTextarea = () =>
      textarea(SERIES_TAGS_TEXTAREA, "series")

    const createCharacterTagsTextarea = () =>
      textarea(CHARACTER_TAGS_TEXTAREA, "characters")

    const createGeneralTagsTextarea = () =>
      textarea(TAGS_TEXTAREA, "tags")

    const createPageTagsCheckbox = () => {
      const label = document.createElement("label")
      const input = element("input", { name: PAGE_TAGS_CHECKBOX, type: "checkbox" })

      label.appendChild(input)
      label.appendChild(document.createTextNode("add page tags"))

      return label
    }

    return () => {
      const wrapper = document.createElement("div")

      wrapper.appendChild(createSeriesTagsTextarea())
      wrapper.appendChild(createCharacterTagsTextarea())
      wrapper.appendChild(createGeneralTagsTextarea())
      wrapper.appendChild(createPageTagsCheckbox())

      return wrapper
    }
  })()

  const createImageList = () => {
    const fieldset = document.createElement("fieldset")
    fieldset.name = IMAGES_FIELDSET
    return fieldset
  }

  const createSubmitButton = () => {
    const submit = document.createElement("button")
    submit.appendChild(document.createTextNode("download"))
    submit.type = "submit"
    return submit
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
    section.appendChild(createTagsTextareas())
    section.appendChild(createSubmitButton())

    form.addEventListener("submit", handleDownload)

    document.body.appendChild(dialog)
    return dialog
  }

  return () => (
    document.getElementById("downloader") as HTMLDialogElement
    ?? createDialog()
  )
})()

type ImgURLs = {
  url: string
  thumb: string
}

const createImgListItem = (() => {
  const IMG_SIZE = 128

  return ({ url, thumb }: ImgURLs) => {
    const label = document.createElement("label")
    const input = document.createElement("input")
    const img = document.createElement("img")

    input.name = IMAGE_CHECKBOX
    input.type = "checkbox"
    input.value = url
    img.height = IMG_SIZE
    img.width = IMG_SIZE
    img.src = thumb

    label.appendChild(input)
    label.appendChild(img)

    return label
  }
})()
