# Markdown in nodekit

Text cards accept as input strings with markdown syntax. The browser renders the markdown string as HTML.

## Text formatting

| Syntax                                                                        | Result                |
|-------------------------------------------------------------------------------|-----------------------|
| `Regular `                                                                    | Regular               |
| `*Italic*`<br>`_Italic_`                                                      | *Italic*              |
| `**Bold**`<br>` __Bold__`                                                     | **Bold**              |
| `**Bold**`<br>` __Bold__ `                                                    | **Bold**              |
| `***Bold and italic***`<br>`**_Bold and italic_**`<br>`__*Bold and italic*__` | ***Bold and italic*** |
| `` `Inline code fencing` ``                                                   | `Inline code fencing` |

## Lists

For unordered lists, bullet points can be either `*` or `_` and will be rendered the same.

```markdown
- Item 1
- Item 2
- Item 3
```

For ordered lists, use a number and a period:

```markdown
1. Item 1
2. Item 2
3. Item 3
```

Added four spaces to indent the list item:

```markdown
1. Item 1
    - Sub item A
    - Sub item B
2. Item 2
    1. Sub item C
    2. Sub item D
```

## Headers

Hashtag/pound sign, followed by a space, followed by text:

| Syntax  | Result      |
|---------|-------------|
| `# h1`  | <h1>h1</h1> |
| `## h2` | <h2>h2</h2> |

This works up to six levels (`######`)

## Colors

To colorize text, use the HTML `<span>` tag:

`<span style="color:#FF00FF">magenta text</span>`

This can be used inline with other markdown text, like this:

`**<span style="color:#FF00FF">bold magenta text</span>**`

## Unsupported syntax

Additional markdown syntax isn't explicitly prohibited but is not supported. The parser will read unsupported markdown but the rendered result might not be consistent or aesthetically acceptable.

A non-exhaustive list of unsupported syntax:

- Any HTML that isn't `<span style="color:color">`. This includes any other style descriptors within a `<span>` tag
- Images
- Links
- Code blocks