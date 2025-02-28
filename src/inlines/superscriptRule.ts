import type InlineParserState from "../types/InlineParserState";
import type InlineRule from "../types/InlineRule";
import type MarkdownNode from "../types/MarkdownNode";
import delimiterLength from "../utils/delimiterLength";
import delimiterState from "../utils/delimiterState";
import isEscaped from "../utils/isEscaped";

const name = "superscript";

function test(state: InlineParserState, parent: MarkdownNode, end: number) {
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
