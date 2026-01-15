const getDialog = (() => {
  const createDialogBase = () => {
    const dialog = document.createElement("dialog")
    const form = document.createElement("form")

    dialog.setAttribute("closedby", "any")
    dialog.setAttribute("id", "downloader")
    form.setAttribute("name", "downloader-form")

    dialog.appendChild(form)

    return { dialog, form }
  }

  const createDialog = () => {
    const { dialog, form } = createDialogBase()

    // etc.

    return dialog
  }

  return () => (
    document.getElementById("downloader") as HTMLDialogElement
    ?? createDialog()
  )
})()
