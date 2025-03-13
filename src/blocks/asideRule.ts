import parseBlock from "../parse/parseBlock";
import type BlockParserState from "../types/BlockParserState";
import type BlockRule from "../types/BlockRule";
import type MidtextNode from "../types/MidtextNode";
import checkBlankLineBefore from "../utils/checkBlankLineBefore";
import countSpaces from "../utils/countSpaces";
import evictBlocks from "../utils/evictBlocks";
import newBlockNode from "../utils/newBlockNode";

const name = "aside";

function testStart(state: BlockParserState) {
	let char = state.src[state.i];
	if (char === "@") {
		let spaces = countSpaces(state.src, state.i + 1);
		let contentColumn = state.indent + 1 + spaces;

		// Close blocks that this node shouldn't be nested under
		evictBlocks(state);

		// Create the node
		let parent = state.openNodes.at(-1)!;

		let asideNode = newBlockNode(name, state, char, state.indent, contentColumn);
		checkBlankLineBefore(state, asideNode, parent);

		parent.children!.push(asideNode);
		state.openNodes.push(asideNode);

		// Parse children
		state.i += 1 + spaces;
		state.indent = contentColumn;
		parseBlock(state, state.openNodes.length - 1);

		return true;
	}

	return false;
}

function testContinue(state: BlockParserState, node: MidtextNode, hadBlankLine: boolean) {
	if (state.src[state.i] === "@") {
		state.i++;
		return true;
	}

	return true;
}

export default {
	name,
	testStart,
	testContinue,
} satisfies BlockRule;
