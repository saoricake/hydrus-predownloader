type FormElements = HTMLInputElement | RadioNodeList | HTMLFieldSetElement

const getInput = <T extends FormElements = HTMLInputElement>(inputName: string) => {
  const form = document.forms.namedItem("downloader-form")!
  return form.elements.namedItem(inputName) as T
}
