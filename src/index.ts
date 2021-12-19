import * as YAML from "yaml"
import type { Schema } from "yaml/types"

interface Alignment {
  h: "left" | "right" | "center"
  v: "top" | "bottom" | "center"
}

/**
 * each params means;
 * value,
 * col span,
 * row span,
 * alignment,
 * table head,
 * attributes
 */
interface TDElm {
  val: string
  cs?: number
  rs?: number
  tag: "th" | "td"
  ali: Alignment
  attrs: { [key: string]: string }
}

const hasOwnProperty = <T extends {}, U extends PropertyKey>(
  obj: T,
  prop: U
): obj is T & Record<U, unknown> => {
  return obj.hasOwnProperty(prop)
}

const isStrings = (arr: any[]): arr is string[] =>
  arr.reduce(
    (pre: boolean, cur: any): boolean => pre && typeof cur === "string",
    true
  )

const is2dimsArray = (arr: any[]): arr is any[][] =>
  arr.reduce(
    (pre: boolean, cur: any): boolean => pre && Array.isArray(cur),
    true
  )

const colSpanRule: Schema.CustomTag = {
  identify: (val) => !val,
  tag: "!cs",
  resolve: () => ({ colspan: true }),
}

const rowSpanRule: Schema.CustomTag = {
  identify: (val) => !val,
  tag: "!rs",
  resolve: () => ({ rowSpan: true }),
}

const tHRule: Schema.CustomTag = {
  identify: (val) => typeof val === "string",
  tag: "!th",
  resolve: (doc, cst) => ({ val: cst.rawValue, tag: "th" }),
}

const tDRule: Schema.CustomTag = {
  identify: (val) => typeof val === "string",
  tag: "!td",
  resolve: (doc, cst) => ({ val: cst.rawValue, tag: "td" }),
}

const createTDElm = (info: TDElm, html: boolean): HTMLTableCellElement => {
  let elm: HTMLTableCellElement = document.createElement(info.tag)
  if (info.cs) {
    elm.colSpan = info.cs
  }
  if (info.rs) {
    elm.colSpan = info.rs
  }

  Object.keys(info.attrs).forEach((attr) => {
    elm.setAttribute(attr, info.attrs[attr])
  })
  elm.style.textAlign = info.ali.h
  elm.style.verticalAlign = info.ali.v

  if (html) {
    elm.innerHTML = info.val
  } else {
    elm.textContent = info.val
  }
  return elm
}

const createtTCellElm = (
  cell: unknown,
  alignment: Alignment,
  callback: (val: any) => string,
  html: boolean,
  { defaultCellTag = "td" }: { defaultCellTag?: "td" | "th" } = {}
): HTMLTableCellElement | null => {
  let cellInfo: TDElm = {
    val: "",
    ali: alignment ? alignment : { h: "center", v: "center" },
    tag: defaultCellTag,
    attrs: {},
  }
  if (cell === null) {
    return cell
  }
  if (typeof cell === "object" && cell && hasOwnProperty(cell, "val")) {
    cellInfo = {
      ...cellInfo,
      ...cell,
      val: callback(cell.val),
    }
  } else {
    cellInfo.val = callback(cell as any)
  }
  return createTDElm(cellInfo, html)
}

const createNonNullTCell2DimsArray = (
  tCell2DimsArray: (HTMLTableCellElement | null)[][]
): HTMLTableCellElement[][] =>
  tCell2DimsArray.map((tCellElms) =>
    tCellElms.filter((tCellElm): tCellElm is HTMLTableCellElement => !!tCellElm)
  )

const createTRowElms = (
  nonNullTCell2DimsArray: HTMLTableCellElement[][]
): HTMLTableRowElement[] =>
  nonNullTCell2DimsArray.map((row) => {
    let tRowElm: HTMLTableRowElement = document.createElement("tr")
    row.forEach((tCellElm) => tRowElm.appendChild(tCellElm))
    return tRowElm
  })

const bindTopCell = (
  tCell2DimsArray: (HTMLTableCellElement | null)[][],
  rowidx: number,
  cellIdx: number
) => {
  for (let i = rowidx; i > 0; i--) {
    let bindingCell = tCell2DimsArray[i - 1][cellIdx]
    if (bindingCell) {
      bindingCell.rowSpan += 1
      tCell2DimsArray[i - 1][cellIdx] = bindingCell
      break
    } else {
      continue
    }
  }
}

const bindLeftCell = (
  tCellElms: (HTMLTableCellElement | null)[],
  cellIdx: number
) => {
  for (let i = cellIdx; i > 0; i--) {
    let bindingCell = tCellElms[i - 1]
    if (bindingCell) {
      bindingCell.colSpan += 1
      tCellElms[i - 1] = bindingCell
      break
    } else {
      continue
    }
  }
}

/**
 * @param {(any) => string} callback - parce each cell
 * @param {string} yamlString - see readme.md
 */
export default (
  yamlString: string,
  {
    callback = (val: any): string => `${val}`,
    html = true,
  }: { callback?: (val: any) => string; html?: boolean } = {}
): HTMLTableElement => {
  YAML.defaultOptions.customTags = [colSpanRule, rowSpanRule, tHRule, tDRule]
  let tableDocs = YAML.parseAllDocuments(yamlString)
  let tableElm: HTMLTableElement = document.createElement("table")

  const isTable = (val: YAML.Document.Parsed): boolean =>
    Array.isArray(val.toJSON()) || val.toJSON() == null
  const existsMetaInfoDoc = tableDocs[0] && !isTable(tableDocs[0])
  const returnDocJson = (defaultNum: number) => {
    if (existsMetaInfoDoc) {
      return tableDocs[defaultNum] ? tableDocs[defaultNum].toJSON() : null
    } else if (tableDocs[defaultNum - 1]) {
      return tableDocs[defaultNum - 1].toJSON()
    } else {
      return null
    }
  }

  // meta info
  //////////////////////////////////////////////////
  let metaInfoDoc: unknown = existsMetaInfoDoc ? tableDocs[0].toJSON() : null

  // caption
  if (
    typeof metaInfoDoc === "object" &&
    metaInfoDoc &&
    hasOwnProperty(metaInfoDoc, "caption")
  ) {
    let tableCaptionElm: HTMLTableCaptionElement =
      document.createElement("caption")
    if (html) {
      tableCaptionElm.innerHTML = callback(metaInfoDoc.caption)
    } else {
      tableCaptionElm.textContent = callback(metaInfoDoc.caption)
    }
    tableElm.appendChild(tableCaptionElm)
  }
  // alignments
  let alignments: Alignment[] = []
  let alignSets: unknown
  if (
    typeof metaInfoDoc === "object" &&
    metaInfoDoc &&
    hasOwnProperty(metaInfoDoc, "alignments")
  ) {
    alignSets = metaInfoDoc.alignments
  }
  if (alignSets && Array.isArray(alignSets) && isStrings(alignSets)) {
    alignments = alignSets
      .map((set) => set.toLowerCase())
      .map((set) => {
        let align: Alignment = {
          h: "center",
          v: "center",
        }
        if (set.indexOf("l") !== -1) {
          align.h = "left"
        } else if (set.indexOf("r") !== -1) {
          align.h = "right"
        }
        if (set.indexOf("t") !== -1) {
          align.v = "top"
        } else if (set.indexOf("b") !== -1) {
          align.v = "bottom"
        }
        return align
      })
  }
  //////////////////////////////////////////////////

  // thead
  //////////////////////////////////////////////////
  let tHeadDoc: unknown = returnDocJson(1)
  let tHeadElm: HTMLTableSectionElement = document.createElement("thead")
  let colGroupLengths: number[] = []

  // transform 1 dim array to 2 dims array
  if (Array.isArray(tHeadDoc) && !is2dimsArray(tHeadDoc)) {
    tHeadDoc = [tHeadDoc]
  }

  if (Array.isArray(tHeadDoc) && is2dimsArray(tHeadDoc)) {
    let tCell2DimsArray: (HTMLTableCellElement | null)[][] = []

    tHeadDoc.forEach((row, idx) => {
      let tCellElms: (HTMLTableCellElement | null)[] = []

      // create row elements
      row.forEach((cell: unknown, cellIdx) => {
        if (typeof cell === "object" && cell) {
          // row span
          if (idx !== 0 && hasOwnProperty(cell, "rowSpan") && cell.rowSpan) {
            bindTopCell(tCell2DimsArray, idx, cellIdx)
            tCellElms.push(null)
            return
          }
          // col span
          if (
            cellIdx !== 0 &&
            hasOwnProperty(cell, "colspan") &&
            cell.colspan
          ) {
            bindLeftCell(tCellElms, cellIdx)
            tCellElms.push(null)
            return
          }
        }

        let tCellElm = createtTCellElm(
          cell,
          alignments[cellIdx],
          callback,
          html,
          {
            defaultCellTag: "th",
          }
        )
        tCellElms.push(tCellElm)
      })
      tCell2DimsArray.push(tCellElms)
    })

    // create non null 2 dims array
    let nonNullTCell2DimsArray: HTMLTableCellElement[][] =
      createNonNullTCell2DimsArray(tCell2DimsArray)

    // set scope
    nonNullTCell2DimsArray.forEach((tCellElms) => {
      tCellElms.forEach((tCellElm) => {
        if (tCellElm.tagName.toLowerCase() == "th") {
          if (tCellElm.colSpan > 1) {
            tCellElm.scope = "colgroup"
          } else {
            tCellElm.scope = "col"
          }
        }
      })
    })

    // create col elements and append them
    if (nonNullTCell2DimsArray.length > 1) {
      colGroupLengths = nonNullTCell2DimsArray[0].map(
        (tCellElm) => tCellElm.colSpan
      )

      let colElms: HTMLTableColElement[] = colGroupLengths.map((length) => {
        if (length == 1) {
          return document.createElement("col")
        } else {
          let elm = document.createElement("colgroup")
          elm.span = length
          return elm
        }
      })
      colElms.forEach((elm) => tableElm.appendChild(elm))
    }

    // append rows to the thead
    createTRowElms(nonNullTCell2DimsArray).forEach((tRowElm) =>
      tHeadElm.appendChild(tRowElm)
    )
    tableElm.appendChild(tHeadElm)
  }
  //////////////////////////////////////////////////

  // tbody
  //////////////////////////////////////////////////
  let tBodyDoc: unknown = returnDocJson(2)
  let tBodyElms: HTMLTableSectionElement[] = []

  // transform 1 dim array to 2 dims array
  if (Array.isArray(tBodyDoc) && !is2dimsArray(tBodyDoc)) {
    tBodyDoc = [tBodyDoc]
  }

  if (Array.isArray(tBodyDoc) && is2dimsArray(tBodyDoc)) {
    let tCell2DimsArray: (HTMLTableCellElement | null)[][] = []

    tBodyDoc.forEach((row, idx) => {
      let tCellElms: (HTMLTableCellElement | null)[] = []

      // create row elements
      row.forEach((cell: unknown, cellIdx) => {
        if (typeof cell === "object" && cell) {
          // row span
          if (idx !== 0 && hasOwnProperty(cell, "rowSpan") && cell.rowSpan) {
            bindTopCell(tCell2DimsArray, idx, cellIdx)
            tCellElms.push(null)
            return
          }
          // col span
          if (
            cellIdx !== 0 &&
            hasOwnProperty(cell, "colspan") &&
            cell.colspan
          ) {
            bindLeftCell(tCellElms, cellIdx)
            tCellElms.push(null)
            return
          }
        }

        let tCellElm = createtTCellElm(
          cell,
          alignments[cellIdx],
          callback,
          html
        )
        tCellElms.push(tCellElm)
      })
      tCell2DimsArray.push(tCellElms)
    })

    // create non null 2 dims array
    let nonNullTCell2DimsArray: HTMLTableCellElement[][] =
      createNonNullTCell2DimsArray(tCell2DimsArray)

    // set scope
    nonNullTCell2DimsArray.forEach((tCellElms) => {
      tCellElms.forEach((tCellElm) => {
        if (tCellElm.tagName.toLowerCase() == "th") {
          if (tCellElm.rowSpan > 1) {
            tCellElm.scope = "rowgroup"
          } else {
            tCellElm.scope = "row"
          }
        }
      })
    })

    // create row groups
    let tCell3DimsArray: HTMLTableCellElement[][][] = []
    let rowGroupLengths: number[] = []
    nonNullTCell2DimsArray.forEach((tCellElms, idx) => {
      tCellElms.some((tCellElm) => {
        if (tCellElm.tagName.toLowerCase() == "th" && tCellElm.rowSpan > 1) {
          rowGroupLengths.push(idx)
          // break
          return true
        }
      })
    })
    rowGroupLengths.push(nonNullTCell2DimsArray.length)
    tCell3DimsArray = rowGroupLengths.slice(0).map((length, idx) => {
      return nonNullTCell2DimsArray.slice(rowGroupLengths[idx - 1], length)
    })

    // create each tbody s and append them
    tCell3DimsArray.forEach((rowGroups) => {
      let tBodyElm: HTMLTableSectionElement = document.createElement("tbody")

      // append rows to the tfoot
      createTRowElms(rowGroups).forEach((tRowElm) =>
        tBodyElm.appendChild(tRowElm)
      )
      tBodyElms.push(tBodyElm)
    })
    tBodyElms.forEach((tBodyElm) => {
      tableElm.appendChild(tBodyElm)
    })
  }
  //////////////////////////////////////////////////

  // tfoot
  //////////////////////////////////////////////////
  let tFootDoc: unknown = returnDocJson(3)
  let tFootElm: HTMLTableSectionElement = document.createElement("tfoot")

  // transform 1 dim array to 2 dims array
  if (Array.isArray(tFootDoc) && !is2dimsArray(tFootDoc)) {
    tFootDoc = [tFootDoc]
  }

  if (Array.isArray(tFootDoc) && is2dimsArray(tFootDoc)) {
    let tCell2DimsArray: (HTMLTableCellElement | null)[][] = []

    tFootDoc.forEach((row, idx) => {
      let tCellElms: (HTMLTableCellElement | null)[] = []

      // create row elements and append them to the tfoot
      row.forEach((cell: unknown, cellIdx) => {
        if (typeof cell === "object" && cell) {
          // row span
          if (idx !== 0 && hasOwnProperty(cell, "rowSpan") && cell.rowSpan) {
            bindTopCell(tCell2DimsArray, idx, cellIdx)
            tCellElms.push(null)
            return
          }
          // col span
          if (
            cellIdx !== 0 &&
            hasOwnProperty(cell, "colspan") &&
            cell.colspan
          ) {
            bindLeftCell(tCellElms, cellIdx)
            tCellElms.push(null)
            return
          }
        }

        let tCellElm = createtTCellElm(
          cell,
          alignments[cellIdx],
          callback,
          html,
          {
            defaultCellTag: "th",
          }
        )
        tCellElms.push(tCellElm)
      })
      tCell2DimsArray.push(tCellElms)
    })

    // create non null 2 dims array
    let nonNullTCell2DimsArray: HTMLTableCellElement[][] =
      createNonNullTCell2DimsArray(tCell2DimsArray)

    // set scope
    nonNullTCell2DimsArray.forEach((tCellElms) => {
      tCellElms.forEach((tCellElm) => {
        if (tCellElm.tagName.toLowerCase() == "th") {
          tCellElm.scope = "row"
        }
      })
    })

    createTRowElms(nonNullTCell2DimsArray).forEach((tRowElm) =>
      tFootElm.appendChild(tRowElm)
    )
    tableElm.appendChild(tFootElm)
  }
  //////////////////////////////////////////////////

  return tableElm
}
