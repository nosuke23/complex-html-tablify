import yaml2HtmlTable from "../src/index"
import outdent from "outdent"
import * as beautify from "js-beautify"

describe("index", () => {
  const testParser = (
    yaml: string,
    expected: string,
    {
      callback = (val: any): string => `${val}`,
      html = true,
    }: { callback?: (val: any) => string; html?: boolean } = {}
  ) => {
    expect(
      beautify.html(
        yaml2HtmlTable(yaml, { callback: callback, html: html }).outerHTML
      )
    ).toBe(beautify.html(expected))
  }

  it("should with caption", () => {
    testParser(
      outdent`
      caption: title
      ---
      ---
      ---
      `,
      outdent`
      <table>
        <caption>title</caption>
      </table>
      `
    )
  })

  it("should align each cell", () => {
    testParser(
      outdent`
      alignments: [tl, br]
      ---
      - first col
      - second col
      ---
      - [1, 2]
      - [3, 4]
      `,
      outdent`
      <table>
        <thead>
            <tr>
                <th style="text-align: left; vertical-align: top;" scope="col">first col</th>
                <th style="text-align: right; vertical-align: bottom;" scope="col">second col</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style="text-align: left; vertical-align: top;">1</td>
                <td style="text-align: right; vertical-align: bottom;">2</td>
            </tr>
            <tr>
                <td style="text-align: left; vertical-align: top;">3</td>
                <td style="text-align: right; vertical-align: bottom;">4</td>
            </tr>
        </tbody>
      </table>
      `
    )
  })

  it("should return simple table", () => {
    testParser(
      outdent`
      ["first col", "second col"]
      ---
      - [1, 2]
      - [3, 4]
      ---
      `,
      outdent`
      <table>
        <thead>
            <tr>
                <th style="text-align: center; vertical-align: center;" scope="col">first col</th>
                <th style="text-align: center; vertical-align: center;" scope="col">second col</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style="text-align: center; vertical-align: center;">1</td>
                <td style="text-align: center; vertical-align: center;">2</td>
            </tr>
            <tr>
                <td style="text-align: center; vertical-align: center;">3</td>
                <td style="text-align: center; vertical-align: center;">4</td>
            </tr>
        </tbody>
      </table> 
      `
    )
  })

  it("should retrun parsed cells", () => {
    testParser(
      outdent`
      - a
      - b
      `,
      outdent`
      <table>
        <thead>
            <tr>
                <th style="text-align: center; vertical-align: center;" scope="col">pre-a</th>
                <th style="text-align: center; vertical-align: center;" scope="col">pre-b</th>
            </tr>
        </thead>
      </table>
      `,
      { callback: (val) => `pre-${val}` }
    )
  })

  it("should return complex tbody", () => {
    testParser(
      outdent`
      ["first col", !cs ]
      ---
      - [1, 2]
      - [!rs , 3]
      `,
      outdent`
      <table>
        <thead>
            <tr>
                <th style="text-align: center; vertical-align: center;" colspan="2" scope="colgroup">first col</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style="text-align: center; vertical-align: center;" rowspan="2">1</td>
                <td style="text-align: center; vertical-align: center;">2</td>
            </tr>
            <tr>
                <td style="text-align: center; vertical-align: center;">3</td>
            </tr>
        </tbody>
      </table>
      `
    )
  })

  /**
   * from https://www.w3.org/WAI/tutorials/tables/irregular/
   */
  it("should return two tier headers", () => {
    testParser(
      outdent`
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
      `,
      outdent`
      <table>
        <col>
        <colgroup span="2"></colgroup>
        <colgroup span="2"></colgroup>
        <thead>
            <tr>
              <td style="text-align: center; vertical-align: center;" rowspan="2"></td>
              <th style="text-align: center; vertical-align: center;" colspan="2" scope="colgroup">Mars</th>
              <th style="text-align: center; vertical-align: center;" colspan="2" scope="colgroup">Venus</th>
            </tr>
            <tr>
                <th style="text-align: center; vertical-align: center;" scope="col">Produced</th>
                <th style="text-align: center; vertical-align: center;" scope="col">Sold</th>
                <th style="text-align: center; vertical-align: center;" scope="col">Produced</th>
                <th style="text-align: center; vertical-align: center;" scope="col">Sold</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <th style="text-align: center; vertical-align: center;" scope="row">Teddy Bears</th>
                <td style="text-align: center; vertical-align: center;">50,000</td>
                <td style="text-align: center; vertical-align: center;">30,000</td>
                <td style="text-align: center; vertical-align: center;">100,000</td>
                <td style="text-align: center; vertical-align: center;">80,000</td>
            </tr>
            <tr>
                <th style="text-align: center; vertical-align: center;" scope="row">Board Games</th>
                <td style="text-align: center; vertical-align: center;">10,000</td>
                <td style="text-align: center; vertical-align: center;">5,000</td>
                <td style="text-align: center; vertical-align: center;">12,000</td>
                <td style="text-align: center; vertical-align: center;">9,000</td>
            </tr>
        </tbody>
      </table>
      `
    )
  })

  it("should return headers spanning multiple rows or columns", () => {
    testParser(
      outdent`
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
      `,
      outdent`
      <table>
        <thead>
            <tr>
              <th style="text-align: center; vertical-align: center;" scope="col">Poster name</th>
              <th style="text-align: center; vertical-align: center;" scope="col">Color</th>
              <th style="text-align: center; vertical-align: center;" colspan="3" scope="colgroup">Sizes available</th>
            </tr>
        </thead>
        <tbody></tbody>
        <tbody>
            <tr>
                <th style="text-align: center; vertical-align: center;" rowspan="3" scope="rowgroup">Zodiac</th>
                <th style="text-align: center; vertical-align: center;" scope="row">Full color</th>
                <td style="text-align: center; vertical-align: center;">A2</td>
                <td style="text-align: center; vertical-align: center;">A3</td>
                <td style="text-align: center; vertical-align: center;">A4</td>
            </tr>
            <tr>
                <th style="text-align: center; vertical-align: center;" scope="row">Black and white</th>
                <td style="text-align: center; vertical-align: center;">A1</td>
                <td style="text-align: center; vertical-align: center;">A2</td>
                <td style="text-align: center; vertical-align: center;">A3</td>
            </tr>
            <tr>
                <th style="text-align: center; vertical-align: center;" scope="row">Sepia</th>
                <td style="text-align: center; vertical-align: center;">A3</td>
                <td style="text-align: center; vertical-align: center;">A4</td>
                <td style="text-align: center; vertical-align: center;">A5</td>
            </tr>
        </tbody>
        <tbody>
            <tr>
                <th style="text-align: center; vertical-align: center;" rowspan="2" scope="rowgroup">Angels</th>
                <th style="text-align: center; vertical-align: center;" scope="row">Black and white</th>
                <td style="text-align: center; vertical-align: center;">A1</td>
                <td style="text-align: center; vertical-align: center;">A3</td>
                <td style="text-align: center; vertical-align: center;">A4</td>
            </tr>
            <tr>
                <th style="text-align: center; vertical-align: center;" scope="row">Sepia</th>
                <td style="text-align: center; vertical-align: center;">A2</td>
                <td style="text-align: center; vertical-align: center;">A3</td>
                <td style="text-align: center; vertical-align: center;">A5</td>
            </tr>
        </tbody>
      </table>
      `
    )
  })

  it("should return big cells", () => {
    testParser(
      outdent`
      ---
      [!td , 1, 1, 1, 1, 1, 1, 1, 1]
      ---
      - [!th 1, 5, !cs , !cs , !cs , !cs , 1, 2, !cs ]
      - [!th 1, !rs , null, null, null, null, 1, !rs , null]
      - [!th 1, !rs , null, null, null, null, 3, !cs , !cs ]
      - [!th 1, !rs , null, null, null, null, !rs , null, null]
      - [!th 1, !rs , null, null, null, null, !rs , null, null]
      `,
      outdent`
      <table>
        <thead>
            <tr>
                <td style="text-align: center; vertical-align: center;"></td>
                <th style="text-align: center; vertical-align: center;" scope="col">1</th>
                <th style="text-align: center; vertical-align: center;" scope="col">1</th>
                <th style="text-align: center; vertical-align: center;" scope="col">1</th>
                <th style="text-align: center; vertical-align: center;" scope="col">1</th>
                <th style="text-align: center; vertical-align: center;" scope="col">1</th>
                <th style="text-align: center; vertical-align: center;" scope="col">1</th>
                <th style="text-align: center; vertical-align: center;" scope="col">1</th>
                <th style="text-align: center; vertical-align: center;" scope="col">1</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <th style="text-align: center; vertical-align: center;" scope="row">1</th>
                <td style="text-align: center; vertical-align: center;" colspan="5" rowspan="5">5</td>
                <td style="text-align: center; vertical-align: center;">1</td>
                <td style="text-align: center; vertical-align: center;" colspan="2" rowspan="2">2</td>
            </tr>
            <tr>
                <th style="text-align: center; vertical-align: center;" scope="row">1</th>
                <td style="text-align: center; vertical-align: center;">1</td>
            </tr>
            <tr>
                <th style="text-align: center; vertical-align: center;" scope="row">1</th>
                <td style="text-align: center; vertical-align: center;" colspan="3" rowspan="3">3</td>
            </tr>
            <tr>
                <th style="text-align: center; vertical-align: center;" scope="row">1</th>
            </tr>
            <tr>
                <th style="text-align: center; vertical-align: center;" scope="row">1</th>
            </tr>
        </tbody>
      </table>
      `
    )
  })

  it("should return without thead", () => {
    testParser(
      outdent`
      ---
      ---
      [1, 2]
      `,
      outdent`
      <table>
        <tbody>
            <tr>
                <td style="text-align: center; vertical-align: center;">1</td>
                <td style="text-align: center; vertical-align: center;">2</td>
            </tr>
        </tbody>
      </table>
      `
    )
  })

  it("should resrict html", () => {
    testParser(
      outdent`
      caption: <a>html</a>
      ---
      ---
      - [<a>html<a>]
      `,
      outdent`
      <table>
        <caption>&lt;a&gt;html&lt;/a&gt;</caption>
        <tbody>
            <tr>
                <td style="text-align: center; vertical-align: center;">&lt;a&gt;html&lt;a&gt;</td>
            </tr>
        </tbody>
      </table>
      `,
      { html: false }
    )
  })
})
