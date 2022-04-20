export {
  hasOwnProperty,
  isStrings,
  is2dimsArray,
  isRowSpan,
  isColSpan,
  isTag,
} from "./type_checking"
export {
  createTableData,
  groupTableDataByRow,
  createTableColIdentifiers,
} from "./create_table_data"
export { appendChildren, createElementWithChildren } from "./create_element"
export { createUnitTableElement, createTCellElement } from "./create_table_cell"
export {
  createTableSectionElement,
  createTableSectionElements,
} from "./create_table_section"
export {
  createTableColElement,
  createTableColElements,
} from "./create_table_col"
export { createTableCaptionElement } from "./create_table_caption"
export { default as customTags } from "./custom_tags"
