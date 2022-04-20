import type { Alignment } from "types/alignment"
import type {
  HTMLTableSectionElementTagName,
  HTMLTableCellElementTagName,
} from "types/tag_name"

export interface TablifyOptions {
  callback?: (val: any) => string
  sanitized?: boolean
  alignments?: Alignment[]
  caption?: string | null
  defaultCellTag?: {
    [key in HTMLTableSectionElementTagName]?: HTMLTableCellElementTagName
  }
}
