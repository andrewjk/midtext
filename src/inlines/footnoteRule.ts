import type Delimiter from "../types/Delimiter";
import type InlineParserState from "../types/InlineParserState";
import type InlineRule from "../types/InlineRule";
import isEscaped from "../utils/isEscaped";
import newDummyNode from "../utils/newDummyNode";
import normalizeLabel from "../utils/normalizeLabel";

let autoid = 1;

function test(state: InlineParserState) {
	let char = state.src[state.i];

	if (char === "[" && state.src[state.i + 1] === "^" && !isEscaped(state.src, state.i)) {
		return testOpen(state);
	}

	if (char === "]" && !isEscaped(state.src, state.i)) {
		return testClose(state);
	}

	if (char === "^" && state.src[state.i + 1] === "[" && !isEscaped(state.src, state.i)) {
		return testShortOpen(state);
	}

	return false;
}

export default {
	name: "footnote",
	test,
} satisfies InlineRule;

function testOpen(state: InlineParserState) {
	state.delimiters.push({
		name: "footnote",
		markup: "[^",
		length: 1,
		line: state.line,
		start: state.i,
		end: -1,
		canOpen: true,
		canClose: false,
	});
	state.i += 1;
	return true;
}

function testClose(state: InlineParserState) {
	// Find the closest matching start delimiter
	let startDelimiter: Delimiter | undefined;
	let i = state.delimiters.length;
	while (i--) {
		let prevDelimiter = state.delimiters[i];
		if (!prevDelimiter.handled) {
			if (prevDelimiter.canOpen) {
				if (prevDelimiter.markup === "[^") {
					startDelimiter = prevDelimiter;
					break;
				}
			}
		}
	}

	if (startDelimiter) {
		// Footnotes cannot be nested
		let d = state.delimiters.length;
		while (d--) {
			let prevDelimiter = state.delimiters[d];
			if (prevDelimiter.name === "footnote" && prevDelimiter.end > startDelimiter.start) {
				startDelimiter.handled = true;
				return false;
			}
		}

		let label = state.src.substring(startDelimiter.start + 1, state.i);

		label = normalizeLabel(label);
		let link = state.refs[label];

		if (link !== undefined) {
			state.meta["footnote-number"] ??= [];
			let number = state.meta["footnote-number"].indexOf(label) + 1;
			if (!number) {
				state.meta["footnote-number"].push(label);
				number = state.meta["footnote-number"].length;
			}

			startDelimiter.handled = true;
			startDelimiter.end = state.i;
			startDelimiter.info = `${number}:${label}`;

			state.i++;
			return true;
		}

		// If we found a matching `[^` but didn't find a link, ignore it in
		// future so that it will be rendered as plain text
		startDelimiter.handled = true;
	}

	return false;
}

function testShortOpen(state: InlineParserState) {
	// It's a short footnote
	let end = -1;
	for (let i = state.i + 2; i < state.src.length; i++) {
		if (state.src[i] === "]" && !isEscaped(state.src, i)) {
			end = i;
			break;
		}
	}
	if (end === -1) {
		return false;
	}

	const label = `fn-auto-${autoid++}`;
	state.refs[label] = "";

	state.meta["footnote-number"] ??= [];
	state.meta["footnote-number"].push(label);
	let number = state.meta["footnote-number"].length;

	let paragraphNode = newDummyNode("paragraph", true);
	paragraphNode.content = state.src.substring(state.i + 2, end);
	paragraphNode.children = [];
	let refNode = newDummyNode("footnote_ref", false);
	refNode.info = label;
	refNode.children = [paragraphNode];
	state.root.children!.push(refNode);

	state.delimiters.push({
		name: "footnote",
		markup: "^[",
		line: state.line,
		start: state.i,
		end,
		length: 1,
		canOpen: false,
		canClose: false,
		info: `${number}:${label}`,
	});

	state.i = end + 1;

	return true;
}
