import parseBlock from "../parse/parseBlock";
import type BlockParserState from "../types/BlockParserState";
import type BlockRule from "../types/BlockRule";
import type MidtextNode from "../types/MidtextNode";
import checkBlankLineBefore from "../utils/checkBlankLineBefore";
import countSpaces from "../utils/countSpaces";
import evictBlocksForNestableNode from "../utils/evictBlocksForNestableNode";
import isNewLine from "../utils/isNewLine";
import newBlockNode from "../utils/newBlockNode";

const name = "block_quote";

/**
 * "A block quote marker consists of 0-3 spaces of initial indent, plus (a) the
 * character > together with a following space, or (b) a single character > not
 * followed by a space.
 *
 * The following rules define block quotes:
 *
 * 1. Basic case. If a string of lines Ls constitute a sequence of blocks Bs,
 *    then the result of prepending a block quote marker to the beginning of
 *    each line in Ls is a block quote containing Bs.
 *
 * 2. Laziness. If a string of lines Ls constitute a block quote with contents
 *    Bs, then the result of deleting the initial block quote marker from one or
 *    more lines in which the next non-whitespace character after the block
 *    quote marker is paragraph continuation text is a block quote with Bs as
 *    its content. Paragraph continuation text is text that will be parsed as
 *    part of the content of a paragraph, but does not occur at the beginning of
 *    the paragraph.
 *
 * 3. Consecutiveness. A document cannot contain two block quotes in a row
 *    unless there is a blank line between them.
 *
 * Nothing else counts as a block quote."
 */

// Blockquotes only depend on indentation for paragraph continuation
// Otherwise, they depend on the number of >
// But you can lazily continue any number of >...

function testStart(state: BlockParserState, parent: MidtextNode) {
	let char = state.src[state.i];
	if (char === ">") {
		let spaces = countSpaces(state.src, state.i + 1);
		let contentColumn = state.indent + 1 + spaces;

		// If it's an empty item, set its content start to just after the marker
		let isEmpty = isNewLine(state.src[state.i + 1]);
		if (isEmpty) {
			contentColumn = state.indent + 1;
		}

		// Close blocks that this node shouldn't be nested under
		evictBlocksForNestableNode(state, name);

		// Create the node
		let lastNode = state.openNodes.at(-1)!;

		let quoteNode = newBlockNode(name, state, char, state.indent, contentColumn);
		checkBlankLineBefore(state, quoteNode, parent);

		lastNode.children!.push(quoteNode);
		state.openNodes.push(quoteNode);

		// Reset the state and parse inside the item
		state.i += 1 + spaces;
		state.indent = contentColumn;
		parseBlock(state, quoteNode);

		return true;
	}

	return false;
}

function testContinue(state: BlockParserState, node: MidtextNode) {
	let level = state.openNodes.indexOf(node);
	let hadBlankLine = state.blankLevel !== -1 && state.blankLevel < level;

	if (state.src[state.i] === ">") {
		if (hadBlankLine) {
			return false;
		} else {
			let spaces = countSpaces(state.src, state.i);
			state.i += 1 + spaces;
			state.indent = state.indent + 1 + spaces;
			return true;
		}
	}

	if (state.indent >= node.subindent) {
		return true;
	}

	if (state.openNodes.at(-1)!.type === "paragraph") {
		return true;
	}

	return false;
}

export default {
	name,
	testStart,
	testContinue,
} satisfies BlockRule;
