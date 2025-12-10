# Markdown in NodeKit

NodeKit supports a defined subset of [CommonMark](https://commonmark.org) for TextCards. Only the syntax below is accepted; unsupported constructs raise a validation error.

## What’s supported
- Paragraphs: separate with a blank line; `<br>` is not supported.
- Headers: `#` through `######` followed by a space and text.
- Emphasis: italic with `*text*` or `_text_`; bold with `**text**` or `__text__`; bold+italic with `***text***` (and equivalents).
- Lists: unordered bullets using any marker (`-`, `*`, `+`, etc.); ordered lists with `1.`. Nest by indenting 4 spaces.
- Color spans: `<span style="color:#rrggbb">text</span>` or `#rrggbbaa`. No other inline HTML or style attributes.

## What’s not supported (will fail validation)
- Inline code or fenced code blocks
- Links and images
- Any HTML beyond the color `<span>` above
- Additional Markdown features (tables, blockquotes, etc.)

## Example
```markdown
# Heading

This is a paragraph with **bold** and _italic_ text.

- First item
    - Nested item
- Second item

Here is <span style="color:#ff00ff">magenta text</span>.
```
