import * as YAML from "yaml"
import customTags from "components/custom_tags"

import * as R from "ramda"

import type { TablifyOptions } from "options"
import type { HTMLTableSectionElementTagName } from "types/tag_name"

import {
  is2dimsArray,
  createElementWithChildren,
  createTableSectionElements,
  createTableColElements,
  createTableCaptionElement,
} from "components"

/**
 * @param {any[][]} data
 * @param {string | string[]} header
 * @param {} options
 * @param {(any) => string} options.callback - Parse each string of cells
 * @param {boolean} options.sanitized - Whether or not to sanitize html string
 * @param {Alignment[]} options.alignments - See README.md
 * @param {string} options.caption - Table caption
 * @param {{[key in HTMLTableSectionElementTagName]?: HTMLTableCellElementTagName}} options.defaultCellTag
 * - Each default cell tag of sections
 */
export default (
  data: unknown[][],
  header: string | string[],
  {
    callback = (val: any): string => `${val}`,
    sanitized = true,
    alignments = [],
    caption = null,
    defaultCellTag: { thead = "th", tbody = "td", tfoot = "td" } = {},
  }: TablifyOptions = {}
): HTMLTableElement => {
  // default cell tag
  const defaultCellTag = { thead, tbody, tfoot }

  // parse
  YAML.defaultOptions.customTags = customTags
  const [topLevelHeader, secondLevelHeader] = R.pipe(
    (headers: string | string[]): string[] =>
      R.is(Array, headers) ? headers : [headers],
    R.map(YAML.parseAllDocuments),
    R.flatten,
    R.map((data): unknown => data?.toJSON())
  )(header)

  const headData: unknown[][] | null = (() => {
    if (
      topLevelHeader &&
      R.is(Array, topLevelHeader) &&
      is2dimsArray(topLevelHeader)
    ) {
      return topLevelHeader
    } else {
      return null
    }
  })()

  const bodyData: unknown[][] = (() => {
    if (
      secondLevelHeader &&
      R.is(Array, secondLevelHeader) &&
      is2dimsArray(secondLevelHeader)
    ) {
      return data.map((_, idx) => R.concat(secondLevelHeader[idx], data[idx]))
    } else {
      return data
    }
  })()

  const sections: [HTMLTableSectionElementTagName, unknown[][]][] = (() => {
    const bodySection: [HTMLTableSectionElementTagName, unknown[][]] = [
      "tbody",
      bodyData,
    ]

    if (R.isNil(headData)) {
      return [bodySection]
    } else {
      return [["thead", headData], bodySection]
    }
  })()
  const sectionElements = createTableSectionElements(sections, {
    callback,
    sanitized,
    alignments,
    defaultCellTag,
  })

  const tableCaptionElement = (() => {
    if (R.isNil(caption)) return null

    return createTableCaptionElement(caption, {
      sanitized,
      callback,
    })
  })()

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
