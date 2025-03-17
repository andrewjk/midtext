import type InlineParserState from "../types/InlineParserState";
import type InlineRule from "../types/InlineRule";
import delimiterLength from "../utils/delimiterLength";
import delimiterState from "../utils/delimiterState";
import isEscaped from "../utils/isEscaped";

const name = "superscript";
const precedence = 0;

function test(state: InlineParserState) {
	let char = state.src[state.i];
	if (char === "^" && !isEscaped(state.src, state.i)) {
		let start = state.i;

		let length = delimiterLength(state.src, char, start);
		let end = state.i + length - 1;

		if (length < 3) {
			let { canOpen, canClose } = delimiterState(state.src, start, end);

			state.delimiters.push({
				name,
				markup: char,
				precedence,
				line: state.line,
				start,
				end: -1,
				length,
				canOpen,
				canClose,
			});
		}

		state.i += length;
		return true;
	}

	return false;
}

export default {
	name,
	test,
} satisfies InlineRule;
