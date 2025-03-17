import { expect, test } from "vitest";
import parse from "../src/parse";

test("offsets", () => {
	const input = `
# Test **some**
 Here is *some* text
and ***some*** more
`.trim();

	const root = parse(input);

	const heading = root.children![0];
	expect(heading.offset).toBe(0);
	expect(heading.line).toBe(0);

	const strong = heading.children![1];
	expect(strong.offset).toBe(7);
	expect(strong.line).toBe(0);
	expect(strong.column).toBe(7);

	const para = root.children![1];
	expect(para.offset).toBe(17);
	expect(para.line).toBe(1);
	expect(para.column).toBe(1);

	const em = para.children![1];
	expect(em.offset).toBe(25);
	expect(em.line).toBe(1);
	expect(em.column).toBe(9);

	const text = para.children![2];
	expect(text.offset).toBe(31);
	expect(text.line).toBe(1);
	expect(text.column).toBe(15);

	const strongem = para.children![3];
	expect(strongem.offset).toBe(41);
	expect(strongem.line).toBe(2);
	expect(strongem.column).toBe(4);
});
