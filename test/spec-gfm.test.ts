import fs from "node:fs";
import { describe, expect, it } from "vitest";
import parse from "../src/parse";
import renderHtml from "../src/renderHtml";

describe("spec: github flavored markdown", () => {
	// Could do this more efficiently
	const path = "./test/spec-gfm.txt";
	const lines = fs.readFileSync(path).toString().split("\n");

	let tests: {
		input: string;
		expected: string;
		header: string;
		//html: string;
	}[] = [];
	for (let i = 0; i < lines.length; i++) {
		if (lines[i].startsWith("```````````````````````````````` example")) {
			let example: string[] = [];
			for (let j = i + 1; j < lines.length; j++) {
				if (lines[j].startsWith("````````````````````````````````")) {
					let parts = example.join("\n").replaceAll("→", "\t").split("\n.");
					let input = parts[0];
					let expected = parts[1] ?? "";
					if (expected.startsWith("\n")) expected = expected.substring(1);

					let header = `Example ${tests.length + 1}, line ${i + 1}: '${input.replaceAll("\n", "\\n").replaceAll("\t", "→")}'`;
					//it(header, () => {
					//  const root = parse(input);
					//  const html = renderHtml(root).trim();
					//  expect(html).toEqual(expected);
					//});

					tests.push({ input, expected, header });

					i = j;
					break;
				} else {
					example.push(lines[j]);
				}
			}
		}
	}

	for (let test of tests) {
		// To only do a certain test, edit the line below
		let ONLY_TEST = 0;
		if (ONLY_TEST && !test.header.includes(`Example ${ONLY_TEST},`)) continue;

		// To diagnose infinite loops; run with `npx vitest --disable-console-intercept`
		//console.log("DOING", test.header);

		let html = "";
		let failed = false;

		try {
			let debug = ONLY_TEST !== 0;
			const root = parse(test.input, debug);
			// TODO: Remove the trimEnd -- only output a newline if there is one in the source
			html = renderHtml(root).trimEnd();

			failed = html !== test.expected;
			if (failed && ONLY_TEST === 0) {
				// Do it again with debugging
				parse(test.input, true);
			}
		} catch {
			console.log("ERROR:", test.header);
			failed = true;
		}

		//if (failed) {
		it(test.header, () => {
			expect(html).toBe(test.expected);
		});
		//}

		if (failed) {
			console.log("FAILED: " + test.header);
			console.log(test.input.replaceAll("\n", "↵"));
			console.log("---------|".repeat(Math.ceil(test.input.length / 10)));
			console.log("\nEXPECTED");
			console.log(test.expected.replaceAll(" ", "•"));
			console.log("\nACTUAL");
			console.log(html.replaceAll(" ", "•"));
			console.log("\nAST");
			console.log(JSON.stringify(removeStuff(parse(test.input, false)), null, 2));
			console.log("\n");
			break;
		} else if (ONLY_TEST) {
			console.log("\nSUCCEEDED: " + test.header);
			console.log(test.input.replaceAll("\n", "↵"));
			console.log("---------|".repeat(Math.ceil(test.input.length / 10)));
			console.log("\nOUTPUT");
			console.log(html.replaceAll(" ", "•"));
			console.log("\nAST");
			console.log(JSON.stringify(removeStuff(parse(test.input, false)), null, 2));
			console.log("\n");
			break;
		}
	}
});

function removeStuff(obj: any) {
	for (let key in obj) {
		if (!["type", "markup", "content", "children", "indent", "subindent", "loose"].includes(key)) {
			delete obj[key];
		}
		if (Array.isArray(obj[key])) {
			for (let child of obj[key]) {
				removeStuff(child);
			}
		} else if (typeof obj[key] === "object") {
			removeStuff(obj[key]);
		}
	}
	return obj;
}
