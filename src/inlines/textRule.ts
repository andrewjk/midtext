import type InlineParserState from "../types/InlineParserState";
import type InlineRule from "../types/InlineRule";

/**
 * The text inline rule handles any character that hasn't been handled by a
 * previous rule
 */
function test(state: InlineParserState) {
	state.i++;
	return true;
}

export default {
	name: "text",
	test,
} satisfies InlineRule;
