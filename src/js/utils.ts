type FormElements = HTMLInputElement | RadioNodeList | HTMLFieldSetElement

const getInput = <T extends FormElements = HTMLInputElement>(inputName: string) => {
  const form = document.forms.namedItem("downloader-form")!
  return form.elements.namedItem(inputName) as T
}

const element = <T extends keyof HTMLElementTagNameMap>(
  tagName: T,
  attributes: Partial<HTMLElementTagNameMap[T]> = {}
) => {
  const ele = document.createElement<T>(tagName)

  for (const [attr, val] of Object.entries(attributes)) {
    ele.setAttribute(attr, val)
  }

  return ele
}
