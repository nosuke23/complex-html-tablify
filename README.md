# Yaml2HtmlTable

This is a YAML parser to create HTML table. It is hard to write complex HTML tables. Markdown syntax can't implement it. This library provide a human friendly way to do it.

## Install

```
npm install yaml2html-table
```

## Usage

```javascript
import yaml2htmlTable from "yaml2html-table"

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

let htmlString = htmlTable.outerHTML // <table>...</table>
```

## Options

- html: `boolean` - evalueate each value of the cells as whether html or text. default is `true`.
- callback: `(val: any) => string` - how to render each value of the cells. default is <code>(val) => \`${val}\`</code> 

## The Rules of Each Document

### The First
Meta infomations. This can be skipped.

Contents: hash

Attributes:

- `caption`: `String` - Caption text.
- `alignments`: `Array` - An array of each alignment. Permitted contents: `t`, `b`, `c`, `l`, `r`, `m` or a combnation of horizontally (left, right and center) and vertically (top, bottom and middle).

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

### The Second
A `thead` element.

Contents: an array, a 2 dimensions array, `null`

Default html tag of cells: `th`

### The Third
`tbody` elements.

Contents: same as thead.

Default html tag of cells: `td`

### The Finally
`tfoot` elements. This can be skipped.

Contents: same as thead.

Default html tag of cells: `th`

## Custom Tags

### HTML Tag

- `!th`: `th` means Table Header. The cell with `!th` tag regarded as a header.
- `!td`: `td` means Table Data. The cell with `!th` tag regarded as a data.

### Span

You can bind cells to an above cell or a left cell.

- `!rs`: `rs` means Row Span. The cell with `!rs` tag is bound to the above cell together.
- `!cs`: `cs` means Column Span. The cell with `!cs` tag is bound to the left cell together.

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
          <th colspan="2" scope="colgroup">first col</th>
      </tr>
  </thead>
  <tbody>
      <tr>
          <td rowspan="2">1</td>
          <td>2</td>
      </tr>
      <tr>
          <td>3</td>
      </tr>
  </tbody>
</table>

<details>
<summary>HTML</summary>

```html
<table>
  <thead>
      <tr>
          <th colspan="2" scope="colgroup">first col</th>
      </tr>
  </thead>
  <tbody>
      <tr>
          <td rowspan="2">1</td>
          <td>2</td>
      </tr>
      <tr>
          <td>3</td>
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
        <td rowspan="2"></td>
        <th colspan="2" scope="colgroup">Mars</th>
        <th colspan="2" scope="colgroup">Venus</th>
      </tr>
      <tr>
          <th scope="col">Produced</th>
          <th scope="col">Sold</th>
          <th scope="col">Produced</th>
          <th scope="col">Sold</th>
      </tr>
  </thead>
  <tbody>
      <tr>
          <th scope="row">Teddy Bears</th>
          <td>50,000</td>
          <td>30,000</td>
          <td>100,000</td>
          <td>80,000</td>
      </tr>
      <tr>
          <th scope="row">Board Games</th>
          <td>10,000</td>
          <td>5,000</td>
          <td>12,000</td>
          <td>9,000</td>
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
        <td rowspan="2"></td>
        <th colspan="2" scope="colgroup">Mars</th>
        <th colspan="2" scope="colgroup">Venus</th>
      </tr>
      <tr>
          <th scope="col">Produced</th>
          <th scope="col">Sold</th>
          <th scope="col">Produced</th>
          <th scope="col">Sold</th>
      </tr>
  </thead>
  <tbody>
      <tr>
          <th scope="row">Teddy Bears</th>
          <td>50,000</td>
          <td>30,000</td>
          <td>100,000</td>
          <td>80,000</td>
      </tr>
      <tr>
          <th scope="row">Board Games</th>
          <td>10,000</td>
          <td>5,000</td>
          <td>12,000</td>
          <td>9,000</td>
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
  - &fc !th Full color
  - A2
  - A3
  - A4
-
  - !rs
  - &bw !th Black and white
  - A1
  - A2
  - A3
- 
  - !rs
  - &s !th Sepia
  - A3
  - A4
  - A5
- 
  - !th Angels
  - *bw
  - A1
  - A3
  - A4
- 
  - !rs
  - *s
  - A2
  - A3
  - A5
```

<blockquote>
<table>
  <thead>
      <tr>
          <th scope="col">Poster name</th>
          <th scope="col">Color</th>
          <th colspan="3" scope="colgroup">Sizes available</th>
      </tr>
  </thead>
  <tbody></tbody>
  <tbody>
      <tr>
          <th rowspan="3" scope="rowgroup">Zodiac</th>
          <th scope="row">Full color</th>
          <td>A2</td>
          <td>A3</td>
          <td>A4</td>
      </tr>
      <tr>
          <th scope="row">Black and white</th>
          <td>A1</td>
          <td>A2</td>
          <td>A3</td>
      </tr>
      <tr>
          <th scope="row">Sepia</th>
          <td>A3</td>
          <td>A4</td>
          <td>A5</td>
      </tr>
  </tbody>
  <tbody>
      <tr>
          <th rowspan="2" scope="rowgroup">Angels</th>
          <th scope="row">Black and white</th>
          <td>A1</td>
          <td>A3</td>
          <td>A4</td>
      </tr>
      <tr>
          <th scope="row">Sepia</th>
          <td>A2</td>
          <td>A3</td>
          <td>A5</td>
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
          <th scope="col">Poster name</th>
          <th scope="col">Color</th>
          <th colspan="3" scope="colgroup">Sizes available</th>
      </tr>
  </thead>
  <tbody></tbody>
  <tbody>
      <tr>
          <th rowspan="3" scope="rowgroup">Zodiac</th>
          <th scope="row">Full color</th>
          <td>A2</td>
          <td>A3</td>
          <td>A4</td>
      </tr>
      <tr>
          <th scope="row">Black and white</th>
          <td>A1</td>
          <td>A2</td>
          <td>A3</td>
      </tr>
      <tr>
          <th scope="row">Sepia</th>
          <td>A3</td>
          <td>A4</td>
          <td>A5</td>
      </tr>
  </tbody>
  <tbody>
      <tr>
          <th rowspan="2" scope="rowgroup">Angels</th>
          <th scope="row">Black and white</th>
          <td>A1</td>
          <td>A3</td>
          <td>A4</td>
      </tr>
      <tr>
          <th scope="row">Sepia</th>
          <td>A2</td>
          <td>A3</td>
          <td>A5</td>
      </tr>
  </tbody>
</table>
```

</details>


### Others

#### Fibonacci Numbers

```yaml
[!td , 1, 1, 1, 1, 1, 1, 1, 1]
---
- [!th 1, 5   , !cs , !cs , !cs , !cs , 1   , 2   , !cs ]
- [!th 1, !rs , null, null, null, null, 1   , !rs , null]
- [!th 1, !rs , null, null, null, null, 3   , !cs , !cs ]
- [!th 1, !rs , null, null, null, null, !rs , null, null]
- [!th 1, !rs , null, null, null, null, !rs , null, null]
```

result: 

<table>
  <thead>
      <tr>
          <td></td>
          <th scope="col">1</th>
          <th scope="col">1</th>
          <th scope="col">1</th>
          <th scope="col">1</th>
          <th scope="col">1</th>
          <th scope="col">1</th>
          <th scope="col">1</th>
          <th scope="col">1</th>
      </tr>
  </thead>
  <tbody>
      <tr>
          <th scope="row">1</th>
          <td colspan="5" rowspan="5">5</td>
          <td>1</td>
          <td colspan="2" rowspan="2">2</td>
      </tr>
      <tr>
          <th scope="row">1</th>
          <td>1</td>
      </tr>
      <tr>
          <th scope="row">1</th>
          <td colspan="3" rowspan="3">3</td>
      </tr>
      <tr>
          <th scope="row">1</th>
      </tr>
      <tr>
          <th scope="row">1</th>
      </tr>
  </tbody>
</table>

<details>
<summary>HTML</summary>

```html
<table>
  <thead>
      <tr>
          <td></td>
          <th scope="col">1</th>
          <th scope="col">1</th>
          <th scope="col">1</th>
          <th scope="col">1</th>
          <th scope="col">1</th>
          <th scope="col">1</th>
          <th scope="col">1</th>
          <th scope="col">1</th>
      </tr>
  </thead>
  <tbody>
      <tr>
          <th scope="row">1</th>
          <td colspan="5" rowspan="5">5</td>
          <td>1</td>
          <td colspan="2" rowspan="2">2</td>
      </tr>
      <tr>
          <th scope="row">1</th>
          <td>1</td>
      </tr>
      <tr>
          <th scope="row">1</th>
          <td colspan="3" rowspan="3">3</td>
      </tr>
      <tr>
          <th scope="row">1</th>
      </tr>
      <tr>
          <th scope="row">1</th>
      </tr>
  </tbody>
</table>
```

</details>

#### Nested Table
  
```yaml
[first table]
---
- 
  -
    - [!th a, !cs ]
    - [1, 2]
    - [!rs , 4]
```

<table>
    <thead>
        <tr>
            <th scope="col">first table</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <table>
                    <tbody>
                        <tr>
                            <th colspan="2">a</th>
                        </tr>
                        <tr>
                            <td rowspan="2">1</td>
                            <td>2</td>
                        </tr>
                        <tr>
                            <td>4</td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    </tbody>
</table>

<details>
<summary>HTML</summary>

```html
<table>
    <thead>
        <tr>
            <th scope="col">first table</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <table>
                    <tbody>
                        <tr>
                            <th colspan="2">a</th>
                        </tr>
                        <tr>
                            <td rowspan="2">1</td>
                            <td>2</td>
                        </tr>
                        <tr>
                            <td>4</td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    </tbody>
</table>
```
</details>