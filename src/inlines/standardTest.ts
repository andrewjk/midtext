import type InlineParserState from "../types/InlineParserState";
import delimiterLength from "../utils/delimiterLength";
import delimiterState from "../utils/delimiterState";
import isEscaped from "../utils/isEscaped";

export default function standardTest(state: InlineParserState, name: string, markup: string) {
	if (state.src[state.i] === markup && !isEscaped(state.src, state.i)) {
		let start = state.i;

		let length = delimiterLength(state.src, markup, start);
		let end = state.i + length - 1;

		if (length < 3) {
			let { canOpen, canClose } = delimiterState(state.src, start, end);
			state.delimiters.push({
				name,
				markup,
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
