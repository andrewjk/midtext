import type InlineParserState from "../types/InlineParserState";
import type InlineRule from "../types/InlineRule";
import isEscaped from "../utils/isEscaped";

function test(state: InlineParserState) {
	let char = state.src[state.i];
	if (char === "/" && state.src[state.i + 1] === "*" && !isEscaped(state.src, state.i)) {
		let start = state.i;
		let closeEnd = state.i + 2;
		for (; closeEnd < state.src.length; closeEnd++) {
			if (state.src[closeEnd] === "*" && state.src[closeEnd + 1] === "/") {
				break;
			}
		}

		state.delimiters.push({
			name: "comment_span",
			markup: char,
			line: state.line,
			start,
			end: closeEnd,
			length: 2,
			canOpen: false,
			canClose: false,
			hidden: true,
		});

		state.i = closeEnd + 2;
		return true;
	}

	return false;
}

export default {
	name: "comment_span",
	test,
} satisfies InlineRule;
