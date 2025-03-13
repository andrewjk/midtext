import type BlockParserState from "../types/BlockParserState";
import type BlockRule from "../types/BlockRule";
import type MidtextNode from "../types/MidtextNode";
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

const name = "heading";

function testStart(state: BlockParserState, parent: MidtextNode) {
	// TODO: Remove trimEnd everywhere
	if (parent.children?.length) {
		const lastChild = parent.children.at(-1)!;
		if (lastChild.type === name && lastChild.content.trimEnd().endsWith("\\")) {
			let endOfLine = getEndOfLine(state);
			let content = state.src.substring(state.i, endOfLine);
			lastChild.content = lastChild.content.trimEnd();
			lastChild.content =
				lastChild.content.substring(0, lastChild.content.length - 1).trimEnd() + "\\\n" + content;
			state.i = endOfLine;
			return true;
		}
	}

	let char = state.src[state.i];
	if (char === "#" && !isEscaped(state.src, state.i)) {
		let level = 1;
		// TODO: peekUntil
		for (let j = state.i + 1; j < state.src.length; j++) {
			if (state.src[j] === "#") {
				level++;
			} else {
				break;
			}
		}
		if (level < 7 && isSpace(state.src.charCodeAt(state.i + level))) {
			// If there's an open paragraph, close it
			if (state.openNodes.at(-1)!.type === "paragraph") {
				state.openNodes.pop();
			}

			// Create the node
			let lastNode = state.openNodes.at(-1)!;

			let headingNode = newBlockNode(name, state, "#".repeat(level), state.indent, state.indent);

			lastNode.children!.push(headingNode);

			// HACK: ignore optional end heading marks and spaces, destructively
			state.i += level;
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
			headingNode.content = state.src.substring(state.i, end + 1);
			state.i = endOfLine;

			return true;
		}
	}

	return false;
}

function testContinue(state: BlockParserState, node: MidtextNode) {
	return false;
}

export default {
	name,
	testStart,
	testContinue,
} satisfies BlockRule;
