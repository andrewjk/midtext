import type BlockParserState from "../types/BlockParserState";
import type BlockRule from "../types/BlockRule";
import countChars from "../utils/countChars";
import countSpaces from "../utils/countSpaces";
import evictBlocks from "../utils/evictBlocks";
import getEndOfLine from "../utils/getEndOfLine";
import isEscaped from "../utils/isEscaped";
import isSpace from "../utils/isSpace";
import newBlockNode from "../utils/newBlockNode";

/**
 * "An ATX heading consists of a string of characters, parsed as inline content,
 * between an opening sequence of 1–6 unescaped # characters and an optional
 * closing sequence of any number of unescaped # characters. The opening
 * sequence of # characters must be followed by a space or by the end of line.
 * The optional closing sequence of #s must be preceded by a space and may be
 * followed by spaces only. The opening # character may be indented 0-3 spaces.
 * The raw contents of the heading are stripped of leading and trailing spaces
 * before being parsed as inline content. The heading level is equal to the
 * number of # characters in the opening sequence."
 */

function testStart(state: BlockParserState) {
	let char = state.src[state.i];
	if (char === "#" && !isEscaped(state.src, state.i)) {
		let level = countChars(state.src, state.i, "#");
		if (level > 6 || !isSpace(state.src.charCodeAt(state.i + level))) {
			return false;
		}

		let markup = "#".repeat(level);
		let spaces = countSpaces(state.src, state.i + level);
		let subindent = state.indent + level + spaces;

		// Close blocks that this node shouldn't be nested under
		evictBlocks(state);

		// Create the node
		let parent = state.openNodes.at(-1)!;

		let node = newBlockNode("heading", state, markup, state.indent, subindent);

		parent.children!.push(node);

		// Ignore optional end heading marks and spaces (but stash them in
		// info if found)
		state.i += level + spaces;
		let endOfLine = getEndOfLine(state);
		let end = endOfLine - 1;
		for (; end >= state.i; end--) {
			if (!isSpace(state.src.charCodeAt(end))) {
				break;
			}
		}
		for (; end >= state.i; end--) {
			if (state.src[end] !== "#") {
				if (state.src[end] === "\\" || !isSpace(state.src.charCodeAt(end))) {
					end = endOfLine - 1;
				}
				break;
			}
		}
		node.content = state.src.substring(state.i, end + 1);
		if (endOfLine > end + 1) {
			node.info = state.src.substring(end, endOfLine);
		}

		state.i = endOfLine;
		return true;
	}

	return false;
}

export default {
	name: "heading",
	testStart,
	testContinue: () => false,
} satisfies BlockRule;
