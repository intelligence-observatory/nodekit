
## Markdown in NodeKit

NodeKit supports a defined subset of [CommonMark](https://commonmark.org) for TextCards. Only the syntax below is supported; unsupported constructs might lead to runtime errors or strange rendering behaviors.

### What’s supported

- Headers: `#` through `######` followed by a space and text (levels above 6 are rejected).
- Italics: use `*text*` or `_text_`;
- Bolding: use `**text**` or `__text__`;
- Italics+Bolding: use `***text***` (and equivalents).
- Paragraphs: separate with a blank line; `<br>` is not supported. Soft line breaks are folded into spaces; hard breaks are not allowed.
- Lists: unordered bullets using any marker (`-`, `*`, `+`, etc.); ordered lists with `1.`.
- Color spans: `<span style="color:#rrggbb">text</span>` or `#rrggbbaa`. No other inline HTML or style attributes.

### What’s not supported

Any other CommonMark features are not supported, including:

- Inline code or fenced code blocks (single or triple backticks)
- Links and images
- Blockquotes, tables, and other Markdown extensions
- Any HTML beyond the color `<span>` above

### Example

```markdown
# Heading

This is a paragraph with **bold** and _italic_ text.

- First item
    - Nested item
- Second item

* Same list, different marker

Here is <span style="color:#ff00ff">magenta text</span>.
```
