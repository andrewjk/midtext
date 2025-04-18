import type BlockParserState from "../types/BlockParserState";
import type BlockRule from "../types/BlockRule";
import type MidtextNode from "../types/MidtextNode";
import checkBlankLineBefore from "../utils/checkBlankLineBefore";
import countSpaces from "../utils/countSpaces";
import evictBlocks from "../utils/evictBlocks";
import getEndOfLine from "../utils/getEndOfLine";
import isEscaped from "../utils/isEscaped";
import newBlockNode from "../utils/newBlockNode";

function testStart(state: BlockParserState) {
	let char = state.src[state.i];
	if (char === "?" && !isEscaped(state.src, state.i)) {
		let spaces = countSpaces(state.src, state.i + 1);
		let subindent = state.indent + 1 + spaces;

		// Close blocks that this node shouldn't be nested under
		evictBlocks(state);

		// Create the node
		let parent = state.openNodes.at(-1)!;

		let node = newBlockNode("details", state, char, state.indent, subindent);
		checkBlankLineBefore(state, node, parent);

		parent.children!.push(node);
		state.openNodes.push(node);

		// Create the summary node
		let end = getEndOfLine(state);
		let content = state.src.substring(state.i + 1 + spaces, end);
		let summaryNode = newBlockNode("summary", state, char, state.indent, subindent);
		summaryNode.content = content;
		node.children!.push(summaryNode);

		state.i = end;

		return true;
	}

	return false;
}

function testContinue(state: BlockParserState, node: MidtextNode, hadBlankLine: boolean) {
	if (state.src[state.i] === "?" && !isEscaped(state.src, state.i)) {
		state.i++;
		return true;
	}

	return true;
}

export default {
	name: "details",
	testStart,
	testContinue,
} satisfies BlockRule;
