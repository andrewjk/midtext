import type BlockParserState from "../types/BlockParserState";
import type BlockRule from "../types/BlockRule";
import type MidtextNode from "../types/MidtextNode";
import checkBlankLineBefore from "../utils/checkBlankLineBefore";
import countSpaces from "../utils/countSpaces";
import getEndOfLine from "../utils/getEndOfLine";
import newBlockNode from "../utils/newBlockNode";

const name = "details";

function testStart(state: BlockParserState, parent: MidtextNode) {
	let char = state.src[state.i];
	if (char === "?") {
		let spaces = countSpaces(state.src, state.i + 1);
		let contentColumn = state.indent + 1 + spaces;

		// Close blocks that this block shouldn't be nested under
		let i = state.openNodes.length;
		while (i-- > 1) {
			let node = state.openNodes[i];
			if (state.indent < node.subindent && node.line !== state.line && node.type !== name) {
				state.openNodes.length = i;
			}
		}

		// If there's an open paragraph, close it
		if (state.openNodes.at(-1)!.type === "paragraph") {
			state.openNodes.pop();
		}

		// Create the node
		let lastNode = state.openNodes.at(-1)!;
		let detailsNode = newBlockNode(name, state, char, state.indent, contentColumn);
		checkBlankLineBefore(state, detailsNode, parent);

		let end = getEndOfLine(state);
		let content = state.src.substring(contentColumn, end);
		let summaryNode = newBlockNode("summary", state, char, state.indent, contentColumn);
		summaryNode.content = content;

		detailsNode.children!.push(summaryNode);

		lastNode.children!.push(detailsNode);
		state.openNodes.push(detailsNode);

		state.i = end;

		return true;
	}

	return false;
}

function testContinue(state: BlockParserState, node: MidtextNode) {
	if (state.src[state.i] === "?") {
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
