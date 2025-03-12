# Midtext

A lightweight text markup language, inspired by Markdown, CommonMark, GFM and Djot.

- Aiming for
  - Simplicity, in logic and parsing
  - Comprehensiveness, so that most things you need are included
  - Flexibility, so that you can add the things you need that aren't included

## Features

### Block structure

- Headings start with `#` or are underlined with `=` or `-`.

- Block quotes start with `>`.

  - Nest block quotes by adding more `>`s on the same line.

- Bulleted lists start with `-`, `*` or `+`.

- Ordered lists start with `1.` or `a.`.

  - Nest lists by indenting past the content start.

  - List looseness is determined by the first item only.

- Fenced code blocks start and end with ```.

  - No indented code blocks to simplify parsing.

- Fenced raw content (such as HTML) starts and ends with `~~~`.

  - Not even attempting to parse HTML.

- Link references are slightly stricter.

- Tables are like GFM, but all columns must be pipe delimited on both sides.

- Task items are like GFM, but with an indeterminate state.

- Plus asides (`@`), details (`?`) and divs (`:::`)

### Inline structure

- Code between ``` or `````
- Emphasis between `*` or `_`
- Bold between `**` or `__`
- Bold emphasis between `***` or `___`
- Strikethrough between `~` or `~~`
- Superscript between `^` or `^^`
- Highlight between `=` or `==`
- Spans between `:` or `::`
- Links between `[` and `]`
- Raw links between `<` and `>`

Code spans take precedence over all other inlines.

To avoid convoluted parsing, inlines match on exact length only. If you need to do some complicated strong/emphasis nesting you will have to switch delimiters.

HTML entities are not decoded.

Any character can be escaped with a `\` and will be passed straight through without being interpreted.

### Attributes

Like Djot, attributes can be added above a block element, or after an inline element, between `{` and `}`.
