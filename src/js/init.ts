const initHiddenInputs = (() => {
  type HiddenInputs = {
    artistIdInput: HTMLInputElement
    illustDateInput: HTMLInputElement
  }

  const getHiddenInputs = (): HiddenInputs => {
    const form = document.forms.namedItem("downloader-form")!
    return {
      artistIdInput: form.elements.namedItem(ARTIST_ID_FIELD) as HTMLInputElement,
      illustDateInput: form.elements.namedItem(ILLUST_DATE_FIELD) as HTMLInputElement
    }
  }

  return async () => {
    const { artistId, illustDate } = await getDateAndUserId()
    const { artistIdInput, illustDateInput } = getHiddenInputs()

    artistIdInput.value = artistId
    illustDateInput.value = illustDate.split("T")[0]
  }
})()

const initArtistNameField = () => {
  const saved = localStorage.getItem(getInput(ARTIST_ID_FIELD).value)
  if (!saved) return
  getInput(ARTIST_NAME_FIELD).value = saved
}

const initImageList = (() => {
  return (imgURLsArray: ImgURLs[]) => {
    const listItems = []

    for (const iu of imgURLsArray) {
      listItems.push(createImgListItem(iu))
    }

    const imgList = getInput<HTMLFieldSetElement>(IMAGES_FIELDSET)
    imgList.replaceChildren(...listItems)
  }
})()
