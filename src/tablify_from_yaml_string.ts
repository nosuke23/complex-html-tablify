import * as YAML from "yaml"
import customTags from "components/custom_tags"

import * as R from "ramda"

import type { Alignment } from "types/alignment"
import type {
  HTMLTableSectionElementTagName,
  HTMLTableCellElementTagName,
} from "types/tag_name"

import {
  createElementWithChildren,
  createTableSectionElements,
  createTableColElements,
  createTableCaptionElement,
} from "components"

/**
 * @param {string} yamlString - See README.md
 * @param {} options
 * @param {(any) => string} options.callback - Parse each string of cells
 * @param {boolean} options.sanitized - Whether or not to sanitize html string
 * @param {Alignment[]} options.alignments - See README.md
 * @param {string} options.caption - Table caption
 * @param {{[key in HTMLTableSectionElementTagName]?: HTMLTableCellElementTagName}} options.defaultCellTag
 * - Each default cell tag of sections
 */
export default (
  yamlString: string,
  {
    callback = (val: any): string => `${val}`,
    sanitized = true,
    alignments = [],
    caption = null,
    defaultCellTag: { thead = "th", tbody = "td", tfoot = "td" } = {},
  }: {
    callback?: (val: any) => string
    sanitized?: boolean
    alignments?: Alignment[]
    caption?: string | null
    defaultCellTag?: {
      [key in HTMLTableSectionElementTagName]?: HTMLTableCellElementTagName
    }
  } = {}
): HTMLTableElement => {
  // default cell tag
  const defaultCellTag = { thead, tbody, tfoot }

  // parse
  YAML.defaultOptions.customTags = customTags
  const docs = YAML.parseAllDocuments(yamlString)
  const data = docs
    .map((data): unknown => data?.toJSON())
    .filter((data) => data)
  const sectionTagNames: HTMLTableSectionElementTagName[] = R.times(
    (idx): HTMLTableSectionElementTagName => {
      if (idx === 0) {
        return "thead"
      } else if (idx >= 2 && idx === data.length - 1) {
        return "tfoot"
      } else {
        return "tbody"
      }
    },
    data.length
  )

  // sections
  const sections = R.zip(sectionTagNames, data)
  const sectionElements = createTableSectionElements(sections, {
    callback,
    sanitized,
    alignments,
    defaultCellTag,
  })

  // caption
  const tableCaptionElement = (() => {
    if (R.isNil(caption)) return null

    return createTableCaptionElement(caption, {
      sanitized,
      callback,
    })
  })()

  // column identifiers
  const tableColElements = createTableColElements(sections, {
    callback,
    sanitized,
    alignments,
  })

  return createElementWithChildren("table", [
    ...(R.isNil(tableCaptionElement) ? [] : [tableCaptionElement]),
    ...tableColElements,
    ...sectionElements,
  ])
}
