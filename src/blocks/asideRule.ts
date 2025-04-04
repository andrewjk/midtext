import parseBlock from "../parse/parseBlock";
import type BlockParserState from "../types/BlockParserState";
import type BlockRule from "../types/BlockRule";
import type MidtextNode from "../types/MidtextNode";
import checkBlankLineBefore from "../utils/checkBlankLineBefore";
import countSpaces from "../utils/countSpaces";
import evictBlocks from "../utils/evictBlocks";
import isEscaped from "../utils/isEscaped";
import newBlockNode from "../utils/newBlockNode";

function testStart(state: BlockParserState) {
	let char = state.src[state.i];
	if (char === "@" && !isEscaped(state.src, state.i)) {
		let spaces = countSpaces(state.src, state.i + 1);
		let subindent = state.indent + 1 + spaces;

		// Close blocks that this node shouldn't be nested under
		evictBlocks(state);

		// Create the node
		let parent = state.openNodes.at(-1)!;

		let node = newBlockNode("aside", state, char, state.indent, subindent);
		checkBlankLineBefore(state, node, parent);

		parent.children!.push(node);
		state.openNodes.push(node);

		// Parse children
		state.i += 1 + spaces;
		state.indent = subindent;
		parseBlock(state, state.openNodes.length - 1);

		return true;
	}

	return false;
}

function testContinue(state: BlockParserState, node: MidtextNode, hadBlankLine: boolean) {
	if (state.src[state.i] === "@" && !isEscaped(state.src, state.i)) {
		state.i++;
		return true;
	}

	return true;
}

export default {
	name: "aside",
	testStart,
	testContinue,
} satisfies BlockRule;
