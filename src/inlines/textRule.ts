import type InlineParserState from "../types/InlineParserState";
import type InlineRule from "../types/InlineRule";
import { isAlphaNumeric } from "../utils/isAlphaNumeric";

/**
 * The text inline rule handles any character that hasn't been handled by a
 * previous rule
 */
function test(state: InlineParserState) {
	state.i++;
	while (isAlphaNumeric(state.src.charCodeAt(state.i))) {
		state.i++;
	}
	return true;
}

export default {
	name: "text",
	test,
} satisfies InlineRule;
