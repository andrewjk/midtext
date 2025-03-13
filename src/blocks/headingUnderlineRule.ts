import type BlockParserState from "../types/BlockParserState";
import type BlockRule from "../types/BlockRule";
import type MidtextNode from "../types/MidtextNode";
import isNewLine from "../utils/isNewLine";
import isSpace from "../utils/isSpace";

/**
 * "A setext heading consists of one or more lines of text, each containing at
 * least one non-whitespace character, with no more than 3 spaces indentation,
 * followed by a setext heading underline. The lines of text must be such that,
 * were they not followed by the setext heading underline, they would be
 * interpreted as a paragraph: they cannot be interpretable as a code fence, ATX
 * heading, block quote, thematic break, list item, or HTML block.
 *
 * A setext heading underline is a sequence of = characters or a sequence of -
 * characters, with no more than 3 spaces indentation and any number of trailing
 * spaces. If a line containing a single - can be interpreted as an empty list
 * items, it should be interpreted this way and not as a setext heading
 * underline.
 *
 * The heading is a level 1 heading if = characters are used in the setext
 * heading underline, and a level 2 heading if - characters are used. The
 * contents of the heading are the result of parsing the preceding lines of text
 * as CommonMark inline content.
 *
 * In general, a setext heading need not be preceded or followed by a blank
 * line. However, it cannot interrupt a paragraph, so when a setext heading
 * comes after a paragraph, a blank line is needed between them."
 */

const name = "heading_underline";

function testStart(state: BlockParserState) {
	let parent = state.openNodes.at(-1)!;

	// An underlined heading requires a paragraph
	if (parent.type !== "paragraph") {
		return false;
	}

	// If the underlined heading is in a block, the underline must be indented
	// past the block's subindent
	// E.g. `> Title\n  ===` is ok, but `> Title\n=== is not`
	if (state.openNodes.length > 2 && state.openNodes.at(-2)!.subindent > state.indent) {
		return false;
	}

	let char = state.src[state.i];
	if (char === "=" || char === "-") {
		let matched = 1;
		let end = state.i + 1;
		for (; end < state.src.length; end++) {
			let nextChar = state.src[end];
			if (nextChar === char) {
				// The heading underline cannot contain internal spaces
				if (matched > 0 && isSpace(state.src.charCodeAt(end - 1))) {
					return false;
				}
				matched++;
			} else if (isNewLine(nextChar)) {
				// TODO: Handle windows crlf
				end++;
				break;
			} else if (isSpace(state.src.charCodeAt(end))) {
				continue;
			} else if (nextChar !== char) {
				return false;
			}
		}

		parent.type = name;
		parent.markup = state.src.substring(state.i, end);

		state.openNodes.pop();

		state.i = end;
		return true;
	}

	return false;
}

function testContinue(state: BlockParserState, node: MidtextNode, hadBlankLine: boolean) {
	return false;
}

export default {
	name,
	testStart,
	testContinue,
} satisfies BlockRule;
