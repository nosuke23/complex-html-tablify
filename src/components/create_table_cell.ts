import type { TableCellData } from "types/cell_data"

interface Options {
  sanitized: boolean
  callback: (val: string) => string
}

export const createUnitTableElement = (
  data: TableCellData[][],
  options: Options
): HTMLTableElement => {
  const cells = data.map((row) =>
    row.map((cell) => createTCellElement(cell, options))
  )

  let tableElement = document.createElement("table")
  let tBodyElement = document.createElement("tbody")
  cells.forEach((row) => row.forEach((cell) => tBodyElement.appendChild(cell)))
  tableElement.appendChild(tBodyElement)

  return tableElement
}

export const createTCellElement = (
  data: TableCellData,
  { sanitized, callback }: Options
): HTMLTableCellElement => {
  let element: HTMLTableCellElement = document.createElement(data.tag)

  // span
  if (data.colSpan && data.colSpan > 1) {
    element.colSpan = data.colSpan
  }
  if (data.rowSpan && data.rowSpan > 1) {
    element.rowSpan = data.rowSpan
  }
  // alignment
  if (data.alignment?.horizontal) {
    element.style.textAlign = data.alignment.horizontal
  }
  if (data.alignment?.vertical) {
    element.style.verticalAlign = data.alignment.vertical
  }
  // child
  if (typeof data.value === "string") {
    if (sanitized) {
      element.textContent = callback(data.value)
    } else {
      element.innerHTML = callback(data.value)
    }
  } else {
    const unitTableElement = createUnitTableElement(data.value, {
      sanitized,
      callback,
    })
    element.appendChild(unitTableElement)
  }

  return element
}
