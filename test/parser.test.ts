import { expect, test } from "vitest";
import parse from "../src/parse";
import renderHtml from "../src/renderHtml";

test("basic parse", () => {
	const input = `
# Test
Here is some text

> * Tight item 1
> * Tight item 2

* A different list

- Loose item 1

- Loose item 2
`;
	const expected = `
<h1>Test</h1>
<p>Here is some text</p>
<blockquote>
<ul>
<li>Tight item 1</li>
<li>Tight item 2</li>
</ul>
</blockquote>
<ul>
<li>A different list</li>
</ul>
<ul>
<li>
<p>Loose item 1</p>
</li>
<li>
<p>Loose item 2</p>
</li>
</ul>
`.trimStart();
	const root = parse(input);
	const html = renderHtml(root);
	expect(html).toBe(expected);
});
