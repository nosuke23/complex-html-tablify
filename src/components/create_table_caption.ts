interface Options {
  sanitized: boolean
  callback: (val: string) => string
}

export const createTableCaptionElement = (
  caption: string,
  { sanitized, callback }: Options
): HTMLTableCaptionElement => {
  let tableCaptionElement = document.createElement("caption")
  if (sanitized) {
    tableCaptionElement.innerHTML = callback(caption)
  } else {
    tableCaptionElement.textContent = callback(caption)
  }
  return tableCaptionElement
}
