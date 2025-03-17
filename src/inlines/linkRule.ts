import type Delimiter from "../types/Delimiter";
import type InlineParserState from "../types/InlineParserState";
import type InlineRule from "../types/InlineRule";
import extractLink from "../utils/extractLink";
import isEscaped from "../utils/isEscaped";

const name = "link";
const precedence = 5;

function test(state: InlineParserState) {
	let char = state.src[state.i];

	if (char === "[" && !isEscaped(state.src, state.i)) {
		return testOpen(state);
	}

	if (char === "]" && !isEscaped(state.src, state.i)) {
		return testClose(state);
	}

	return false;
}

export default {
	name,
	test,
} satisfies InlineRule;

function testOpen(state: InlineParserState) {
	state.delimiters.push({
		name: "link",
		markup: "[",
		precedence,
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
				if (prevDelimiter.markup === "[") {
					startDelimiter = prevDelimiter;
					break;
				} else if (prevDelimiter.markup === "![") {
					return false;
				}
			} else {
				continue;
			}
		}
	}

	if (startDelimiter) {
		let label = state.src.substring(startDelimiter.start + startDelimiter.markup.length, state.i);
		let { link, skip } = extractLink(state, label);

		if (link !== undefined) {
			// Remove all the opening link delimiters so they won't be picked up in future
			let d = state.delimiters.length;
			while (d--) {
				let prevDelimiter = state.delimiters[d];
				if (prevDelimiter.precedence === precedence) {
					prevDelimiter.handled = true;
				}
			}

			state.delimiters.push({
				name,
				markup: startDelimiter.markup,
				precedence,
				length: 1,
				line: state.line,
				start: state.i - 1,
				end: -1,
				handled: true,
				canOpen: false,
				canClose: true,
			});

			startDelimiter.handled = true;
			startDelimiter.end = state.i - 1;
			startDelimiter.info = link;
			startDelimiter.skip = skip;

			return true;
		}

		// If we found a matching `[` but didn't find a link, ignore it in
		// future so that it will be rendered as plain text
		startDelimiter.handled = true;
	}

	return false;
}
