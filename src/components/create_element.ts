export const appendChildren = <T extends Node>(parent: T, children: Node[]) => {
  const element = <T>parent.cloneNode(true)
  children.forEach((child) => {
    element.appendChild(child)
  })

  return element
}

export const createElementWithChildren = <
  T extends keyof HTMLElementTagNameMap
>(
  tag: T,
  children: Node[],
  { options }: { options?: ElementCreationOptions | undefined } = {}
) => {
  const element = document.createElement(tag, options)
  children.forEach((child) => {
    element.appendChild(child)
  })

  return element
}
