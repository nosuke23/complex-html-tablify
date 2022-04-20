import type { Schema } from "yaml/types"
import type { RowSpan, ColSpan, TableCell } from "types/custom_tag"

export const colSpanRule: Schema.CustomTag = {
  identify: (val) => !val,
  tag: "!cs",
  resolve: (): ColSpan => ({ colSpan: true }),
}

export const rowSpanRule: Schema.CustomTag = {
  identify: (val) => !val,
  tag: "!rs",
  resolve: (): RowSpan => ({ rowSpan: true }),
}

export const tHRule: Schema.CustomTag = {
  identify: (val) => typeof val === "string",
  tag: "!th",
  resolve: (_, cst): TableCell => ({ value: cst.rawValue || "", tag: "th" }),
}

export const tDRule: Schema.CustomTag = {
  identify: (val) => typeof val === "string",
  tag: "!td",
  resolve: (_, cst): TableCell => ({ value: cst.rawValue || "", tag: "td" }),
}

export default [colSpanRule, rowSpanRule, tHRule, tDRule]
