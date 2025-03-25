import parseAttributes from "../parse/parseAttributes";
import type InlineParserState from "../types/InlineParserState";
import type InlineRule from "../types/InlineRule";
import consumeAttributes from "../utils/consumeAttributes";
import isEscaped from "../utils/isEscaped";

function test(state: InlineParserState) {
	if (state.src[state.i] === "{" && !isEscaped(state.src, state.i)) {
		const lastDelimiter = state.delimiters.at(-1);
		if (lastDelimiter) {
			const content = consumeAttributes(state.src, state.i);
			if (content) {
				lastDelimiter.attributes = parseAttributes(content);

				// Extend the last delimiter past the attributes
				lastDelimiter.start += content.length + 2;
				lastDelimiter.skip = content.length + 2;

				state.i += content.length + 2;
				return true;
			}
		}
	}

	return false;
}

export default {
	name: "inline_attributes",
	test,
} satisfies InlineRule;
