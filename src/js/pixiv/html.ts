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

  const createImageList = () => {
    const fieldset = document.createElement("fieldset")
    fieldset.id = "imageList"
    fieldset.name = "images"
    return fieldset
  }

  const createDialog = () => {
    const { dialog, form } = createDialogBase()

    form.appendChild(createImageList())

    document.body.appendChild(dialog)
    return dialog
  }

  return () => (
    document.getElementById("downloader") as HTMLDialogElement
    ?? createDialog()
  )
})()

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
