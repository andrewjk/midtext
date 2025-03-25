import type InlineParserState from "../types/InlineParserState";
import type InlineRule from "../types/InlineRule";
import delimiterLength from "../utils/delimiterLength";
import delimiterState from "../utils/delimiterState";
import isEscaped from "../utils/isEscaped";

function test(state: InlineParserState) {
	let char = state.src[state.i];
	if ((char === "*" || char === "_") && !isEscaped(state.src, state.i)) {
		let start = state.i;

		let length = delimiterLength(state.src, char, start);
		let end = state.i + length - 1;

		let { canOpen, canClose } = delimiterState(state.src, start, end);

		state.i += length;
		state.delimiters.push({
			name: length >= 3 ? "strong_emphasis" : length === 2 ? "strong" : "emphasis",
			markup: char,
			line: state.line,
			start,
			end: -1,
			length,
			canOpen,
			canClose,
		});

		return true;
	}

	return false;
}

export default {
	name: "emphasis",
	test,
} satisfies InlineRule;
