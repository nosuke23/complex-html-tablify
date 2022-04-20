import type { RowSpan, ColSpan, TableCell } from "types/custom_tag"

export const hasOwnProperty = <T extends {}, U extends PropertyKey>(
  obj: T,
  prop: U
): obj is T & Record<U, unknown> => {
  return obj.hasOwnProperty(prop)
}

export const isStrings = (arr: any[]): arr is string[] =>
  arr.reduce(
    (pre: boolean, cur: any): boolean => pre && typeof cur === "string",
    true
  )

export const is2dimsArray = (arr: any[]): arr is any[][] =>
  arr.reduce(
    (pre: boolean, cur: any): boolean => pre && Array.isArray(cur),
    true
  )

export const isRowSpan = (cell: unknown): cell is RowSpan =>
  !!(
    typeof cell === "object" &&
    cell &&
    hasOwnProperty(cell, "rowSpan") &&
    typeof cell.rowSpan === "boolean" &&
    cell.rowSpan
  )

export const isColSpan = (cell: unknown): cell is ColSpan =>
  !!(
    typeof cell === "object" &&
    cell &&
    hasOwnProperty(cell, "colSpan") &&
    typeof cell.colSpan === "boolean" &&
    cell.colSpan
  )

export const isTag = (cell: unknown): cell is TableCell =>
  !!(
    typeof cell === "object" &&
    cell &&
    hasOwnProperty(cell, "tag") &&
    cell.tag
  )
