import * as R from "ramda"
import { __ } from "ramda"

import type { Alignment } from "types/alignment"
import type { TableColData } from "types/cell_data"
import type {
  HTMLTableSectionElementTagName,
  HTMLTableCellElementTagName,
} from "types/tag_name"

import { is2dimsArray } from "components/type_checking"
import {
  createTableData,
  createTableColIdentifiers,
} from "components/create_table_data"

export const createTableColElement = (
  data: TableColData
): HTMLTableColElement => {
  let tableColElement = document.createElement(data.tag)
  if (data.tag === "colgroup") {
    tableColElement.span = data.span
  }

  return tableColElement
}

export const createTableColElements = (
  sections: [HTMLTableSectionElementTagName, unknown][],
  {
    sanitized,
    callback,
    alignments,
    defaultCellTag = "th",
  }: {
    sanitized: boolean
    callback: (val: string) => string
    alignments: Alignment[]
    defaultCellTag?: HTMLTableCellElementTagName
  }
): HTMLTableColElement[] => {
  const [, headData] = sections[0]
  if (!R.is(Array, headData)) return []

  const createTableDataWithOptions = R.curry(createTableData)(__, {
    callback,
    sanitized,
    alignments,
    defaultCellTag,
  })

  return R.pipe(
    (data) => (is2dimsArray(data) ? data : [data]),
    (data) => createTableDataWithOptions(data)[0] || [],
    createTableColIdentifiers,
    R.map(createTableColElement)
  )(headData)
}
