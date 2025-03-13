import parseBlock from "../parse/parseBlock";
import type BlockParserState from "../types/BlockParserState";
import type BlockRule from "../types/BlockRule";
import type MarkdownNode from "../types/MarkdownNode";
import countSpaces from "../utils/countSpaces";
import newBlockNode from "../utils/newBlockNode";

const name = "aside";

function testStart(state: BlockParserState, parent: MarkdownNode) {
	let char = state.src[state.i];
	if (char === "@") {
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

		let asideNode = newBlockNode(name, state.i, state.line, state.indent, char, state.indent);
		asideNode.subindent = contentColumn;
		asideNode.attributes = state.attributes;
		delete state.attributes;

		let level = state.openNodes.indexOf(parent);
		if (state.blankLevel !== -1 && state.blankLevel <= level) {
			asideNode.blankBefore = true;
			state.blankLevel = -1;
		}

		lastNode.children!.push(asideNode);
		state.openNodes.push(asideNode);

		// Parse children
		state.i += 1 + spaces;
		state.indent = contentColumn;
		parseBlock(state, asideNode);

		return true;
	}

	return false;
}

function testContinue(state: BlockParserState, node: MarkdownNode) {
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
