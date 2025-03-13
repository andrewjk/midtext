import type BlockParserState from "../types/BlockParserState";
import type BlockRule from "../types/BlockRule";
import type MidtextNode from "../types/MidtextNode";
import checkBlankLineBefore from "../utils/checkBlankLineBefore";
import evictBlocks from "../utils/evictBlocks";
import isNewLine from "../utils/isNewLine";
import isSpace from "../utils/isSpace";
import newBlockNode from "../utils/newBlockNode";

/**
 * "A line consisting of 0-3 spaces of indentation, followed by a sequence of
 * three or more matching -, _, or * characters, each followed optionally by any
 * number of spaces or tabs, forms a thematic break."
 */

const name = "section_break";

function testStart(state: BlockParserState) {
	let char = state.src[state.i];
	if (char === "-" || char === "_" || char === "*") {
		let matched = 1;
		let end = state.i + 1;
		for (; end < state.src.length; end++) {
			let nextChar = state.src[end];
			if (nextChar === char) {
				matched++;
			} else if (isNewLine(nextChar)) {
				// TODO: Handle windows crlf
				end++;
				break;
			} else if (isSpace(state.src.charCodeAt(end))) {
				continue;
			} else {
				return false;
			}
		}
		if (matched >= 3) {
			// Close blocks that this node shouldn't be nested under
			evictBlocks(state);

			// Create the node
			let parent = state.openNodes.at(-1)!;

			let markup = state.src.substring(state.i, end);
			let breakNode = newBlockNode(name, state, markup, state.indent, state.indent);
			checkBlankLineBefore(state, breakNode, parent);

			parent.children!.push(breakNode);
			state.i = end;
			return true;
		}
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
