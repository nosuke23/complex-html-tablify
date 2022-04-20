# Complex HTML Tablify

Complex HTML Tablify provide a human friendly way to write complex HTML table by YAML syntax and simple tags.

## Install

```
npm install complex-html-tablify
```

## Usage Examples

### Simple

#### [Table with two tier headers](https://www.w3.org/WAI/tutorials/tables/irregular/)

```javascript
import { tablifyFromYamlString } from "complex-html-tablify"

const data = `
# The first document is treated as a table header
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

const caption = "Table with two tier headers"
const options = {
  caption,
}

const htmlTable = tablifyFromYamlString(data, options) //-> HTMLTableElement
const htmlString = htmlTable.outerHTML //-> <table>...</table>
```

output:

<table>
    <caption>Table with two tier headers</caption>
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

<details>
<summary>HTML</summary>

```html
<table>
  <caption>
    Table with two tier headers
  </caption>
  <col />
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
```

</details>

### Data with Headers

#### [Table with headers spanning multiple rows or columns](https://www.w3.org/WAI/tutorials/tables/irregular/)

```javascript
import { tablifyWithHeader } from "complex-html-tablify"

const firstLevelHeader = `
-
  - Poster name
  - Color
  - Sizes available
  - !cs
  - !cs
`
const secondLevelHeader = `
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
const options = { caption }

const htmlTable = tablifyWithHeader(data, header, options)
const htmlString = htmlTable.outerHTML
```

output:

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

<details>
<summary>HTML</summary>

```html
<table>
  <caption>
    Poster availability
  </caption>
  <col />
  <col />
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
```

</table>
</details>

Note: This library consists functional components, so you can use those in compbination.

## Custom YAML Tags

### HTML Tag

- `!th`: Table Header. The cell with `!th` tag regarded as a header.
- `!td`: Table Data. The cell with `!th` tag regarded as a data.

### Span

You can bind cells to an above or a left cell.

- `!rs`: Row Span. The cell with `!rs` tag is bound to the above cell together.
- `!cs`: Column Span. The cell with `!cs` tag is bound to the left cell together.

## Options

- callback: `(val: any) => string` (default: <code>(val) => \`${val}\`</code>) - Evaluate each value of cells.

- sanitized: `boolean` (default: `true`) - Unenable HTML tags in each cell.

- alignments: `Array<{horizontal?: string; vertical?: string}>` (default: `[]`) - Align each cells of columns.

  - horiznotal: - Using the keyword values: `start`, `end`, `left`, `right`, `center`, `justify`, `justify-all`, or `match-parent`.
  - vertical: - Using the keyword values: `baseline`, `sub`, `super`, `text-top`, `text-bottom`, `middle`, `top`, or `bottom`.

- caption: `string | null` (default: `null`) - Define a table caption.

- defaultCellTag: `{[key in HTMLTableSectionElementTagName]?: HTMLTableCellElementTagName}` (default: `{ thead: "th", tbody: "td", tfoot: "td" }`) - Define each default cell tag of sections.

  - HTMLTableSectionElementTagName: `thead`, `tbody` or `tfoot`
  - HTMLTableCellElementTagName: `th` or `td`
