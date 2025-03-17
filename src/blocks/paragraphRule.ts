import type BlockParserState from "../types/BlockParserState";
import type BlockRule from "../types/BlockRule";
import type MidtextNode from "../types/MidtextNode";
import checkBlankLineBefore from "../utils/checkBlankLineBefore";
import getEndOfLine from "../utils/getEndOfLine";
import newBlockNode from "../utils/newBlockNode";

/**
 * "A sequence of non-blank lines that cannot be interpreted as other kinds of
 * blocks forms a paragraph. The contents of the paragraph are the result of
 * parsing the paragraph’s raw content as inlines. The paragraph’s raw content
 * is formed by concatenating the lines and removing initial and final
 * whitespace."
 */

const name = "paragraph";

function testStart(state: BlockParserState) {
	let parent = state.openNodes.at(-1)!;
	let hadBlankLine = state.blankLevel !== -1 && state.blankLevel < state.openNodes.length;

	let endOfLine = getEndOfLine(state);

	if (parent.acceptsContent) {
		let startOfLine = state.atLineEnd ? state.lineStart : state.lineStart + parent.indent;
		let content = state.src.substring(startOfLine, endOfLine);
		parent.content += content;
		state.i = endOfLine;
		state.blankLevel = -1;
		return true;
	}

	let content = state.src.substring(state.i, endOfLine);
	let haveParagraph = parent.name === name;

	// TODO: Proper blank checking
	// TODO: Move this to parseindent too
	// TODO: Can we just do this as a hasBlankLine test??
	if (!/[^\s]/.test(content)) {
		state.i += content.length;
		if (haveParagraph) {
			state.openNodes.pop();
		}
		return true;
	}

	// Evict open blocks that this paragraph can't continue
	if (hadBlankLine) {
		let i = state.openNodes.length;
		while (i-- > 1) {
			let node = state.openNodes[i];
			if (state.indent < node.subindent) {
				state.openNodes.length = i;
			}
		}
		parent = state.openNodes.at(-1)!;
	}

	let paragraph = haveParagraph
		? parent
		: newBlockNode(name, state, "", state.indent, state.indent);
	paragraph.content += content;
	checkBlankLineBefore(state, paragraph, parent);

	if (!haveParagraph) {
		parent.children!.push(paragraph);
		state.openNodes.push(paragraph);
	}

	state.i = endOfLine;

	return true;
}

function testContinue(state: BlockParserState, node: MidtextNode, hadBlankLine: boolean) {
	if (!hadBlankLine) {
		return true;
	}

	return false;
}

export default {
	name,
	testStart,
	testContinue,
	acceptsContent: true,
} satisfies BlockRule;
