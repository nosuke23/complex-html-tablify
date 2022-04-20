import * as beautify from "js-beautify"
import { outdent } from "outdent"

import { tablifyFromYamlString, tablifyWithHeader } from "../src/index"

import type { Alignment } from "../src/types/alignment"

describe("index", () => {
  describe("tablifyFromYamlString", () => {
    const parse = (
      data: string,
      options: Parameters<typeof tablifyFromYamlString>[1] = {}
    ): string => beautify.html(tablifyFromYamlString(data, options).outerHTML)

    it("should tie cells", () => {
      const data = outdent`
      - 
        - !td
        - Mars
        - !cs 
        - Venus
        - !cs 
      - 
        - !rs
        - &h1 Produced
        - &h2 Sold
        - *h1
        - *h2
      ---
      - 
        - !th Teddy Bears
        - 50,000
        - 30,000
        - 100,000
        - 80,000
      - 
        - !th Board Games
        - 10,000
        - 5,000
        - 12,000
        - 9,000
    `

      const expected = outdent`
      <table>
          <col>
          <colgroup span="2"></colgroup>
          <colgroup span="2"></colgroup>
          <thead>
              <tr>
                  <td rowspan="2"></td>
                  <th colspan="2">Mars</th>
                  <th colspan="2">Venus</th>
              </tr>
              <tr>
                  <th>Produced</th>
                  <th>Sold</th>
                  <th>Produced</th>
                  <th>Sold</th>
              </tr>
          </thead>
          <tbody>
              <tr>
                  <th>Teddy Bears</th>
                  <td>50,000</td>
                  <td>30,000</td>
                  <td>100,000</td>
                  <td>80,000</td>
              </tr>
              <tr>
                  <th>Board Games</th>
                  <td>10,000</td>
                  <td>5,000</td>
                  <td>12,000</td>
                  <td>9,000</td>
              </tr>
          </tbody>
      </table>
    `
      expect(parse(data)).toBe(expected)
    })

    it("should group bodeis", () => {
      const data = outdent`
      - Poster name
      - Color
      - Sizes available
      - !cs
      - !cs
      ---
      -
        - !th Zodiac
        - !th Full color
        - A2
        - A3
        - A4
      -
        - !rs
        - !th Black and white
        - A1
        - A2
        - A3
      - 
        - !rs
        - !th Sepia
        - A3
        - A4
        - A5
      - 
        - !th Angels
        - !th Black and white
        - A1
        - A3
        - A4
      - 
        - !rs
        - !th Sepia
        - A2
        - A3
        - A5
    `

      const expected = outdent`
      <table>
          <col>
          <col>
          <colgroup span="3"></colgroup>
          <thead>
              <tr>
                  <th>Poster name</th>
                  <th>Color</th>
                  <th colspan="3">Sizes available</th>
              </tr>
          </thead>
          <tbody>
              <tr>
                  <th rowspan="3">Zodiac</th>
                  <th>Full color</th>
                  <td>A2</td>
                  <td>A3</td>
                  <td>A4</td>
              </tr>
              <tr>
                  <th>Black and white</th>
                  <td>A1</td>
                  <td>A2</td>
                  <td>A3</td>
              </tr>
              <tr>
                  <th>Sepia</th>
                  <td>A3</td>
                  <td>A4</td>
                  <td>A5</td>
              </tr>
          </tbody>
          <tbody>
              <tr>
                  <th rowspan="2">Angels</th>
                  <th>Black and white</th>
                  <td>A1</td>
                  <td>A3</td>
                  <td>A4</td>
              </tr>
              <tr>
                  <th>Sepia</th>
                  <td>A2</td>
                  <td>A3</td>
                  <td>A5</td>
              </tr>
          </tbody>
      </table>
    `
      expect(parse(data)).toBe(expected)
    })

    describe("options", () => {
      it("should align cells", () => {
        const data = outdent`
        - [1, 2]
        ---
        - [3, !cs]
        `

        const alignments: Alignment[] = [
          { horizontal: "left" },
          { horizontal: "right" },
        ]

        const expected = outdent`
        <table>
            <thead>
                <tr>
                    <th style="text-align: left;">1</th>
                    <th style="text-align: right;">2</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td colspan="2" style="text-align: left;">3</td>
                </tr>
            </tbody>
        </table>
        `

        expect(parse(data, { alignments })).toBe(expected)
      })

      it("should sanitize html", () => {
        const data = outdent`
        - [1, 2]
        ---
        - [3, !cs]
        `

        const callback = (val: any) => `<em>${val}</em>`

        const expected = outdent`
        <table>
            <thead>
                <tr>
                    <th>&lt;em&gt;&lt;em&gt;1&lt;/em&gt;&lt;/em&gt;</th>
                    <th>&lt;em&gt;&lt;em&gt;2&lt;/em&gt;&lt;/em&gt;</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td colspan="2">&lt;em&gt;&lt;em&gt;3&lt;/em&gt;&lt;/em&gt;</td>
                </tr>
            </tbody>
        </table>
        `
        const notExpected = outdent`
        <table>
            <thead>
                <tr>
                    <th><em><em>1</em></em></th>
                    <th><em><em>2</em></em></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td colspan="2"><em><em>3</em></em></td>
                </tr>
            </tbody>
        </table>
        `

        expect(parse(data, { callback, sanitized: true })).toBe(expected)
        expect(parse(data, { callback, sanitized: false })).toBe(notExpected)
      })

      it("should add a caption", () => {
        const data = outdent`
        - [1, 2]
        ---
        - [3, !cs]
        `
        const caption = "caption"

        const expected = outdent`
        <table>
            <caption>caption</caption>
            <thead>
                <tr>
                    <th>1</th>
                    <th>2</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td colspan="2">3</td>
                </tr>
            </tbody>
        </table>
        `

        expect(parse(data, { caption })).toBe(expected)
      })
    })
  })

  describe("tablifyWithHeader", () => {
    const parse = (
      data: unknown[][],
      header: string | string[],
      options: Parameters<typeof tablifyWithHeader>[2] = {}
    ): string =>
      beautify.html(tablifyWithHeader(data, header, options).outerHTML)

    it("should return with headers", () => {
      const firstLevelHeader = outdent`
        -
          - Poster name
          - Color
          - Sizes available
          - !cs
          - !cs
        `
      const secondLevelHeader = outdent`
        -
          - !th Zodiac
          - !th Full color
        -
          - !rs
          - !th Black and white
        - 
          - !rs
          - !th Sepia
        - 
          - !th Angels
          - !th Black and white
        - 
          - !rs
          - !th Sepia
        `
      const header = [firstLevelHeader, secondLevelHeader]

      const data = [
        ["A2", "A3", "A4"],
        ["A1", "A2", "A3"],
        ["A3", "A4", "A5"],
        ["A1", "A3", "A4"],
        ["A2", "A3", "A5"],
      ]

      const caption = "Poster availability"

      expect(parse(data, header, { caption })).toBe(outdent`
      <table>
          <caption>Poster availability</caption>
          <col>
          <col>
          <colgroup span="3"></colgroup>
          <thead>
              <tr>
                  <th>Poster name</th>
                  <th>Color</th>
                  <th colspan="3">Sizes available</th>
              </tr>
          </thead>
          <tbody>
              <tr>
                  <th rowspan="3">Zodiac</th>
                  <th>Full color</th>
                  <td>A2</td>
                  <td>A3</td>
                  <td>A4</td>
              </tr>
              <tr>
                  <th>Black and white</th>
                  <td>A1</td>
                  <td>A2</td>
                  <td>A3</td>
              </tr>
              <tr>
                  <th>Sepia</th>
                  <td>A3</td>
                  <td>A4</td>
                  <td>A5</td>
              </tr>
          </tbody>
          <tbody>
              <tr>
                  <th rowspan="2">Angels</th>
                  <th>Black and white</th>
                  <td>A1</td>
                  <td>A3</td>
                  <td>A4</td>
              </tr>
              <tr>
                  <th>Sepia</th>
                  <td>A2</td>
                  <td>A3</td>
                  <td>A5</td>
              </tr>
          </tbody>
      </table>
      `)
    })
  })
})
