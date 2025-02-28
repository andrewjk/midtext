import type InlineParserState from "../types/InlineParserState";
import type InlineRule from "../types/InlineRule";
import type MarkdownNode from "../types/MarkdownNode";

const name = "text";

/**
 * The text inline rule handles any character that hasn't been handled by a
 * previous rule
 */
function test(state: InlineParserState, parent: MarkdownNode) {
	state.i++;
	return true;
}

export default {
	name,
	test,
} satisfies InlineRule;
