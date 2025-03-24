import fs from "node:fs";
import { describe, expect, it } from "vitest";
import parse from "../src/parse";
import renderHtml from "../src/renderHtml";
import { tidyFields } from "./tidyFields";

const ONLY_TEST = 0;
const OUTPUT_FIELDS = ["name", "markup", "content", "children", "indent", "subindent"];

describe("spec: midtext", () => {
	// Could do this more efficiently
	const path = "./spec.txt";
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
		if (ONLY_TEST && !test.header.includes(`Example ${ONLY_TEST},`)) {
			continue;
		}

		// To diagnose infinite loops; run with `npx vitest --disable-console-intercept`
		//console.log("DOING", test.header);

		let html = "";
		let failed = false;

		try {
			const root = parse(test.input);
			// TODO: Remove the trimEnd -- only output a newline if there is one in the source
			html = renderHtml(root).trimEnd();
			failed = html !== test.expected;
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
			console.log(JSON.stringify(tidyFields(parse(test.input), OUTPUT_FIELDS), null, 2));
			console.log("\n");
			break;
		} else if (ONLY_TEST) {
			console.log("\nSUCCEEDED: " + test.header);
			console.log(test.input.replaceAll("\n", "↵"));
			console.log("---------|".repeat(Math.ceil(test.input.length / 10)));
			console.log("\nOUTPUT");
			console.log(html.replaceAll(" ", "•"));
			console.log("\nAST");
			console.log(JSON.stringify(tidyFields(parse(test.input), OUTPUT_FIELDS), null, 2));
			console.log("\n");
			break;
		}
	}
});
