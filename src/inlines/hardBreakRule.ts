import type InlineParserState from "../types/InlineParserState";
import type InlineRule from "../types/InlineRule";
import isNewLine from "../utils/isNewLine";

const name = "hard_break";

function test(state: InlineParserState) {
	if (state.src[state.i] === "\\" && isNewLine(state.src[state.i + 1])) {
		state.delimiters.push({
			name,
			markup: "\n",
			line: state.line,
			start: state.i,
			end: state.i + 1,
			length: 1,
			canOpen: false,
			canClose: false,
			// HACK:
			content: "!",
		});

		state.i += 2;

		return true;
	}

	return false;
}

export default {
	name,
	test,
} satisfies InlineRule;
