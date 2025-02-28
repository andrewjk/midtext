import type BlockParserState from "../types/BlockParserState";
import type BlockRule from "../types/BlockRule";
import type MarkdownNode from "../types/MarkdownNode";
import isNewLine from "../utils/isNewLine";
import isSpace from "../utils/isSpace";
import newBlockNode from "../utils/newBlockNode";

/**
 * "A line consisting of 0-3 spaces of indentation, followed by a sequence of
 * three or more matching -, _, or * characters, each followed optionally by any
 * number of spaces or tabs, forms a thematic break."
 */

const name = "section_break";

function testStart(state: BlockParserState, parent: MarkdownNode) {
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
			// Remove any open nodes that start further to the right than this one
			let i = state.openNodes.length;
			while (i-- > 1) {
				let node = state.openNodes[i];
				if (node.column >= state.indent) {
					state.openNodes.length = i;
				}
			}
			parent = state.openNodes.at(-1)!;

			// If there's an open paragraph, close it
			if (parent.type === "paragraph") {
				state.openNodes.pop();
				parent = state.openNodes.at(-1)!;
			}

			let markup = state.src.substring(state.i, end);
			let breakNode = newBlockNode(name, state.i, state.line, 1, markup, 0);
			breakNode.attributes = state.attributes;
			delete state.attributes;

			parent.children!.push(breakNode);
			state.i = end;
			return true;
		}
	}

	return false;
}

function testContinue(state: BlockParserState, node: MarkdownNode) {
	return false;
}

export default {
	name,
	testStart,
	testContinue,
} satisfies BlockRule;
