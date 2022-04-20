import * as R from "ramda"
import { __ } from "ramda"

import type { Alignment } from "types/alignment"
import type {
  HTMLTableSectionElementTagName,
  HTMLTableCellElementTagName,
} from "types/tag_name"
import type { TableCellData } from "types/cell_data"

import { is2dimsArray } from "components/type_checking"
import { createElementWithChildren } from "components/create_element"
import { createTCellElement } from "components/create_table_cell"
import {
  createTableData,
  groupTableDataByRow,
} from "components/create_table_data"

export const createTableSectionElement = (
  tag: HTMLTableSectionElementTagName,
  data: TableCellData[][],
  options: {
    sanitized: boolean
    callback: (val: string) => string
  }
): HTMLTableSectionElement =>
  createElementWithChildren(
    tag,
    data.map((row) =>
      createElementWithChildren(
        "tr",
        row.map((cell) => createTCellElement(cell, options))
      )
    )
  )

export const createTableSectionElements = (
  sections: [HTMLTableSectionElementTagName, unknown][],
  {
    sanitized,
    callback,
    alignments,
    defaultCellTag,
  }: {
    sanitized: boolean
    callback: (val: string) => string
    alignments: Alignment[]
    defaultCellTag: {
      [key in HTMLTableSectionElementTagName]: HTMLTableCellElementTagName
    }
  }
): HTMLTableSectionElement[] =>
  sections
    .map((section) => {
      const [sectionTagName, sectionData] = section
      const defaultCellTagName = defaultCellTag[sectionTagName]
      if (!R.is(Array, sectionData)) return []

      const createTableDataWithOptions = R.curry(createTableData)(__, {
        callback,
        sanitized,
        alignments,
        defaultCellTag: defaultCellTagName,
      })
      const createTableSectionElementWithOptions = R.curry(
        createTableSectionElement
      )(sectionTagName, __, {
        sanitized,
        callback,
      })

      return R.pipe(
        (data) => (is2dimsArray(data) ? data : [data]),
        createTableDataWithOptions,
        groupTableDataByRow,
        R.map(createTableSectionElementWithOptions)
      )(sectionData)
    })
    .flat()
