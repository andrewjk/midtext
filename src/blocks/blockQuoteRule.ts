import parseBlock from "../parseBlock";
import type BlockParserState from "../types/BlockParserState";
import type BlockRule from "../types/BlockRule";
import type MarkdownNode from "../types/MarkdownNode";
import countSpaces from "../utils/countSpaces";
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

function testStart(state: BlockParserState, parent: MarkdownNode) {
	//if (state.hasBlankLine) {
	//	let lastNode = state.openNodes.at(-1)!;
	//	if (lastNode.type === name) {
	//		state.openNodes.length -= 1;
	//	}
	//}

	//if (state.openNodes[state.ni].type === name) {
	//	let lastNode = state.openNodes[state.ni];
	//	// Continue if there's a blank line, or the indent is past the subindent
	//	if (
	//		state.hasBlankLine ||
	//		state.indent >= lastNode.subindent ||
	//		state.openNodes.length - 1 === state.ni ||
	//		state.openNodes[state.ni + 1].type === "paragraph"
	//	) {
	//	} else {
	//		state.openNodes.length = state.ni;
	//	}
	//}

	let char = state.src[state.i];
	if (char === ">") {
		let spaces = countSpaces(state.src, state.i + 1);
		let contentColumn = state.indent + 1 + spaces;

		// If it's an empty item, set its content start to just after the marker
		let isEmpty = isNewLine(state.src[state.i + 1]);
		if (isEmpty) {
			contentColumn = state.indent + 1;
		}

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

		let quoteNode = newBlockNode(name, state.i, state.line, state.indent, char, state.indent);
		quoteNode.subindent = contentColumn;
		quoteNode.attributes = state.attributes;
		delete state.attributes;

		lastNode.children!.push(quoteNode);
		state.openNodes.push(quoteNode);

		// Reset the state and parse inside the item
		state.i += 1 + spaces;
		state.hasBlankLine = false;
		state.indent = contentColumn;
		parseBlock(state, quoteNode);

		return true;
	}

	return false;
}

function testContinue(state: BlockParserState, node: MarkdownNode) {
	if (state.hasBlankLine) {
		node.loose = true;
	}

	if (!node.loose && state.src[state.i] === ">") {
		let spaces = countSpaces(state.src, state.i);
		state.i += 1 + spaces;
		state.indent = state.indent + 1 + spaces;
		return true;
	}

	if (state.hasBlankLine) {
		return true;
	}

	if (state.indent >= node.subindent) {
		return true;
	}

	if (
		!state.hadBlankLine &&
		//state.indent >= node.column &&
		//state.indent < node.subindent &&
		state.openNodes.at(-1)!.type === "paragraph"
		//state.openNodes.at(state.openNodes.indexOf(node) + 1)!.column >= node.subindent
	) {
		return true;
	}

	//if (!state.hadBlankLine) {
	//	return true;
	//}

	return false;
}

export default {
	name,
	testStart,
	testContinue,
} satisfies BlockRule;
