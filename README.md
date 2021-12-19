# Yaml2HtmlTable

This is a YAML parser to create HTML table. It is hard to write complex HTML tables. Markdown syntax can't implement it. This library provide a human friendly way to do it.

## Install

```
npm install yaml2html-table
```

## Usage

```javascript
import yaml2htmlTable from "Yaml2HtmlTable"

let htmlTable = yaml2htmlTable(`
caption: title
---
# thead
[a, b, c, d]
---
# tbody
- [1, 2, 3, 4]
- [5, 6, 7, 8]
---
# tfoot
- [6, 8, 10, 12]
`) // HTMLTableElement
```

## Rules

### Each Document

#### The First
Meta infomations. You can skip this.

Contents: hash
Attributes:

- `caption`: `String` Caption text.
- `alignments`: `Array` An array of each alignment. Permitted contents: `t`, `b`, `l`, `r`, or a combnation of vertically and horizontally.

e.g.

```yaml
caption: title
alignments: [tl, br]
---
[first col, second col]
---
- [1, 2]
```

result:

<details>
<summary>HTML</summary>

```html
<table>
  <caption>title</caption>
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
  </tbody>
</table>
```

</details>

#### The Second
A `thead` element.

Contents: an array, a 2 dimensions array, `null`
Default cell tag: `th`

#### The Third
`tbody` elements.

Contents: same as thead
Default cell tag: `td`

#### The Finally
`tfoot` elements. You can skip this.

Contents: same as thead
Default cell tag: `th`

### Custom Tags

#### HTML Tag

- `!th`: `th` means Table Header
- `!td`: `td` means Table Data

#### Span

You can bind cells to above cell or left cell.

- `!rs`: rs means Row Span. The cell with `!rs` tag is bind the above cell.
- `!cs`: cs means Column Span. The cell with `!cs` tag is bind the left cell.

e.g. 
```yaml
["first col", !cs ]
---
- [1, 2]
- [!rs , 3]
```

result:

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

<details>
<summary>HTML</summary>

```html
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
```

</details>

## Examples

### [Tables with irregular headers](https://www.w3.org/WAI/tutorials/tables/irregular/)

#### Table with two tier headers

```yaml
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
```

result:

<blockquote>
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
</blockquote>

<details>
<summary>HTML</summary>

```html
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
```

</details>

#### Table with headers spanning multiple rows or columns

```yaml
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
  - A2
  - A3
  - A4
- 
  - !rs
  - !th Sepia
  - A2
  - A3
  - A5
```

<blockquote>
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
          <td style="text-align: center; vertical-align: center;">A2</td>
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
</blockquote>

<details>
<summary>HTML</summary>

```html
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
          <td style="text-align: center; vertical-align: center;">A2</td>
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
```

</details>


### Others

```yaml
[!td , 1, 1, 1, 1, 1, 1, 1, 1]
---
- [!th 1, 5, !cs , !cs , !cs , !cs , 1, 2, !cs ]
- [!th 1, !rs , null, null, null, null, 1, !rs , null]
- [!th 1, !rs , null, null, null, null, 3, !cs , !cs ]
- [!th 1, !rs , null, null, null, null, !rs , null, null]
- [!th 1, !rs , null, null, null, null, !rs , null, null]
```

result: 

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

<details>
<summary>HTML</summary>

```html
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
```

</details>