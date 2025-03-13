import type BlockParserState from "../types/BlockParserState";
import type BlockRule from "../types/BlockRule";
import type MarkdownNode from "../types/MarkdownNode";
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

function testStart(state: BlockParserState, parent: MarkdownNode) {
	let lastNode = state.openNodes.at(-1)!;

	let endOfLine = getEndOfLine(state);

	if (lastNode.acceptsContent) {
		let startOfLine = state.atLineEnd ? state.lineStart : state.lineStart + lastNode.indent;
		let content = state.src.substring(startOfLine, endOfLine);
		lastNode.content += content;
		state.i = endOfLine;
		state.blankLevel = -1;
		return true;
	}

	let content = state.src.substring(state.i, endOfLine);
	let haveParagraph = lastNode.type === name;

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

	let paragraph = haveParagraph
		? lastNode
		: newBlockNode(name, state.i, state.line, state.i - state.lineStart, "", 0);
	paragraph.content += content;
	paragraph.subindent = paragraph.column;
	paragraph.attributes = state.attributes;
	delete state.attributes;

	let level = state.openNodes.indexOf(parent);
	if (state.blankLevel !== -1 && state.blankLevel <= level) {
		paragraph.blankBefore = true;
		state.blankLevel = -1;
	}

	if (!haveParagraph) {
		lastNode.children!.push(paragraph);
		state.openNodes.push(paragraph);
	}

	state.i = endOfLine;

	return true;
}

function testContinue(state: BlockParserState, node: MarkdownNode) {
	let level = state.openNodes.indexOf(node);
	let hadBlankLine = state.blankLevel !== -1 && state.blankLevel < level;

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
