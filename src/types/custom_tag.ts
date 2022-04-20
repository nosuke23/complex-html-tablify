import type { HTMLTableCellElementTagName } from "types/tag_name"

export interface RowSpan {
  rowSpan: boolean
}

export interface ColSpan {
  colSpan: boolean
}

export interface TableCell {
  value: string
  tag: HTMLTableCellElementTagName
}
