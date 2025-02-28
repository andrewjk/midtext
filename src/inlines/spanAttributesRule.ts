import parseAttributes from "../parseAttributes";
import type InlineParserState from "../types/InlineParserState";
import type InlineRule from "../types/InlineRule";
import type MarkdownNode from "../types/MarkdownNode";
import consumeAttributes from "../utils/consumeAttributes";

const name = "span_attributes";

function test(state: InlineParserState, parent: MarkdownNode, end: number) {
	let char = state.src[state.i];
	if (char === "{") {
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
	name,
	test,
} satisfies InlineRule;
