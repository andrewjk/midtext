import parseBlock from "../parse/parseBlock";
import type BlockParserState from "../types/BlockParserState";
import type BlockRule from "../types/BlockRule";
import type MidtextNode from "../types/MidtextNode";
import checkBlankLineBefore from "../utils/checkBlankLineBefore";
import countSpaces from "../utils/countSpaces";
import evictBlocksForNestableNode from "../utils/evictBlocksForNestableNode";
import isEscaped from "../utils/isEscaped";
import isNewLine from "../utils/isNewLine";
import newBlockNode from "../utils/newBlockNode";

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

function testStart(state: BlockParserState) {
	let char = state.src[state.i];
	if (char === ">" && !isEscaped(state.src, state.i)) {
		let spaces = countSpaces(state.src, state.i + 1);
		let subindent = state.indent + 1 + spaces;

		// If it's an empty item, set its content start to just after the marker
		let isEmpty = isNewLine(state.src[state.i + 1]);
		if (isEmpty) {
			subindent = state.indent + 1;
		}

		// Close blocks that this node shouldn't be nested under
		evictBlocksForNestableNode(state, "block_quote");

		// Create the node
		let parent = state.openNodes.at(-1)!;

		let node = newBlockNode("block_quote", state, char, state.indent, subindent);
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
	if (state.src[state.i] === ">" && !isEscaped(state.src, state.i)) {
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

	if (state.openNodes.at(-1)!.name === "paragraph") {
		return true;
	}

	return false;
}

export default {
	name: "block_quote",
	testStart,
	testContinue,
} satisfies BlockRule;
