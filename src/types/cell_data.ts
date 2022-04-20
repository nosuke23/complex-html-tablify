import type { Alignment } from "types/alignment"

import type {
  HTMLTableCellElementTagName,
  HTMLTableColElementTagName,
} from "./tag_name"

export interface TableCellData {
  value: string | TableCellData[][]
  tag: HTMLTableCellElementTagName
  colSpan: number | null
  rowSpan: number | null
  alignment: Alignment | null
}

export interface TableColData {
  tag: HTMLTableColElementTagName
  span: number
}
