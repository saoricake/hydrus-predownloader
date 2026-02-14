type IllustResponseBody = {
  createDate: string
  userId: string
}

const isIllustPage = () => /\/artworks\/\d+$/.test(location.pathname)

const getImgId = () => {
  const match = location.pathname.match(/\/artworks\/(\d+)$/)!
  return match[match.length - 1]
}

const getDateAndUserId = () =>
  fetch(`${location.origin}/ajax/illust/${getImgId()}`)
    .then<{ body: IllustResponseBody }>(r => r.json())
    .then(
      ({ body: { createDate, userId } }) =>
        ({ artistId: userId, illustDate: createDate })
    )

const getImgURLs = (() => {
  type ImgURLs = {
    url: string
    thumb: string
  }

  type IllustPageResponseBody = {
    urls: {
      original: string
      regular: string
      small: string
      thumb_mini: string
    }
    height: number
    width: number
  }[]

  return async () => {
    const imgId = getImgId()
    const res = await fetch(`${location.origin}/ajax/illust/${imgId}/pages`)

    while (!res.ok) {
      /** @todo handle connection errors */
    }

    const resBody: IllustPageResponseBody = (await res.json()).body
    return resBody.map<ImgURLs>(({ urls }) => ({
      url: urls.original,
      thumb: urls.thumb_mini
    }))
  }
})()
