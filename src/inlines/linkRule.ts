import type Delimiter from "../types/Delimiter";
import type InlineParserState from "../types/InlineParserState";
import type InlineRule from "../types/InlineRule";
import extractLink from "../utils/extractLink";
import isEscaped from "../utils/isEscaped";

const name = "link";

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
		name,
		markup: "[",
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
	let startDelimiterIndex = -1;
	let i = state.delimiters.length;
	while (i--) {
		let prevDelimiter = state.delimiters[i];
		if (!prevDelimiter.handled) {
			if (prevDelimiter.canOpen) {
				if (prevDelimiter.markup === "[") {
					startDelimiter = prevDelimiter;
					startDelimiterIndex = i;
					break;
				}
			} else {
				continue;
			}
		}
	}

	if (startDelimiter) {
		// Links cannot be nested
		let d = state.delimiters.length;
		while (d--) {
			let prevDelimiter = state.delimiters[d];
			if (prevDelimiter.name === name && prevDelimiter.end > startDelimiter.start) {
				startDelimiter.handled = true;
				return false;
			}
		}

		let label = state.src.substring(startDelimiter.start + 1, state.i);
		let { link, skip } = extractLink(state, label);

		if (link !== undefined) {
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
