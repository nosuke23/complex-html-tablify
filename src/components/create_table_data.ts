import type { TableCellData, TableColData } from "types/cell_data"
import type { Alignment } from "types/alignment"
import type { RowSpan } from "types/custom_tag"
import type { HTMLTableCellElementTagName } from "types/tag_name"
import {
  isRowSpan,
  isColSpan,
  is2dimsArray,
  isTag,
} from "components/type_checking"

interface RowData {
  tag: HTMLTableCellElementTagName
  span: number
}

interface ColData {
  tag: HTMLTableCellElementTagName
  span: number
}

interface Options {
  sanitized: boolean
  alignments: Alignment[]
  callback: (val: any) => string
  defaultCellTag?: HTMLTableCellElementTagName
}

export const createTableData = (
  data: unknown[][],
  { sanitized, alignments, callback, defaultCellTag = "td" }: Options
): TableCellData[][] =>
  data
    .map((row) =>
      row
        .map((cell, idx): TableCellData | RowSpan | null => {
          if (!cell) return null
          if (isColSpan(cell)) return null
          if (isRowSpan(cell)) return cell

          const { value, tag } = (() => {
            if (isTag(cell)) {
              return cell
            } else if (Array.isArray(cell)) {
              // nested table
              const nestingData = createTableData(
                ((cell) => {
                  if (is2dimsArray(cell)) {
                    return cell
                  } else {
                    return [cell]
                  }
                })(cell),
                { defaultCellTag, sanitized, alignments: [], callback }
              )
              return {
                value: nestingData,
                tag: defaultCellTag,
              }
            } else {
              return {
                value: cell,
                tag: defaultCellTag,
              }
            }
          })()
          const colSpan = (() => {
            const colSpanLength = row.slice(idx + 1).reduce<[number, boolean]>(
              (acc, cur) => {
                if (acc[1] && isColSpan(cur)) {
                  return [acc[0] + 1, true]
                } else {
                  return [acc[0], false]
                }
              },
              [1, true]
            )[0]

            if (colSpanLength === 1) {
              return null
            } else {
              return colSpanLength
            }
          })()

          return {
            value: callback(value || ""),
            tag,
            colSpan,
            rowSpan: null,
            alignment: alignments[idx],
          }
        })
        .filter(<T>(cell: T | null): cell is T => cell !== null)
    )
    .map((row, rowIdx, data) =>
      row
        .map((cell, colIdx): TableCellData | null => {
          if (isRowSpan(cell)) return null

          const rowSpan = (() => {
            const rowSpanLength = data
              .map((row) => row[colIdx])
              .slice(rowIdx + 1)
              .reduce<[number, boolean]>(
                (acc, cur) => {
                  if (acc[1] && isRowSpan(cur)) {
                    return [acc[0] + 1, true]
                  } else {
                    return [acc[0], false]
                  }
                },
                [1, true]
              )[0]

            if (rowSpanLength === 1) {
              return null
            } else {
              return rowSpanLength
            }
          })()

          return { ...cell, rowSpan }
        })
        .filter(<T>(cell: T | null): cell is T => cell !== null)
    )
    .filter((row) => row.length)

export const groupTableDataByRow = (
  data: TableCellData[][]
): TableCellData[][][] => {
  const rowData: RowData[] = data
    .map((row) => ({
      tag: row[0].tag,
      span: row[0].rowSpan,
    }))
    .filter((data): data is RowData => data.span !== null)
  if (!rowData.filter((data) => data.tag === "th" && data.span > 1).length)
    return [data]

  const rowLengthes = rowData.map((data) => data.span)

  return rowLengthes
    .map((_, idx, length) =>
      length.slice(0, idx + 1).reduce((acc, cur) => acc + cur)
    )
    .map((rowIdx, idx, rowIdxes) =>
      data.slice(idx === 0 ? 0 : rowIdxes[idx - 1], rowIdx)
    )
}

export const createTableColIdentifiers = (
  data: TableCellData[]
): TableColData[] => {
  const colData: ColData[] = data.map((col) => ({
    tag: col.tag,
    span: col.colSpan || 1,
  }))
  if (!colData.filter((data) => data.tag === "th" && data.span > 1).length)
    return []

  const colLengths = colData.map((data) => data.span)

  return colLengths.map((length) => ({
    tag: length > 1 ? "colgroup" : "col",
    span: length,
  }))
}
