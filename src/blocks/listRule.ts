import parseBlock from "../parseBlock";
import type BlockParserState from "../types/BlockParserState";
import type BlockRule from "../types/BlockRule";
import type MarkdownNode from "../types/MarkdownNode";
import countSpaces from "../utils/countSpaces";
import isNewLine from "../utils/isNewLine";
import newBlockNode from "../utils/newBlockNode";

export interface ListInfo {
	delimiter: string;
	markup: string;
	isBlank: boolean;
	type: string;
}

function testStart(state: BlockParserState, parent: MarkdownNode, info?: ListInfo) {
	// HACK: Special blank line check for loose lists and empty lists
	if (state.hasBlankLine) {
		if (state.openNodes.length > 3) {
			const [listNode, itemNode, paragraphNode] = state.openNodes.slice(
				state.openNodes.length - 3,
				state.openNodes.length,
			);
			if (itemNode.type === "list_item" && paragraphNode.block) {
				paragraphNode.loose = true;
				if (listNode.children!.length === 1) {
					// If there's a list with one child, mark it as loose
					listNode.loose = true;
				} else if (!listNode.loose) {
					// If there's a tight list with more than one child, remove it,
					// it's done
					state.openNodes.length -= 3;
					state.hasBlankLine = false;
				}
			}
		}
	}

	if (info) {
		const name = info.type;

		let spaces = countSpaces(state.src, state.i + info.markup.length);
		let contentColumn = state.indent + info.markup.length + spaces;

		// If it's an empty item, set its content start to just after the marker
		let isEmpty = isNewLine(state.src[state.i + info.markup.length]);
		if (isEmpty) {
			contentColumn = state.indent + info.markup.length;
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
		let haveNode = lastNode.type === name;

		// Create the new item
		let itemNode = newBlockNode(
			"list_item",
			state.i,
			state.line,
			state.indent,
			info.markup,
			state.indent,
		);
		itemNode.attributes = state.attributes;
		delete state.attributes;

		// Create or continue the list
		let listNode = haveNode
			? lastNode
			: newBlockNode(name, state.i, state.line, state.indent, info.markup, state.indent);
		listNode.subindent = itemNode.subindent = contentColumn;
		listNode.delimiter = itemNode.delimiter = info.delimiter;
		listNode.children!.push(itemNode);
		if (!haveNode) {
			lastNode.children!.push(listNode);
			state.openNodes.push(listNode);
			state.openNodes.push(itemNode);
		} else {
			state.openNodes.push(itemNode);
		}

		// Reset the state and parse inside the item
		state.i += info.markup.length + spaces;
		state.hasBlankLine = false;
		state.indent = contentColumn;
		parseBlock(state, itemNode);

		return true;
	}

	return false;
}

function testContinue(state: BlockParserState, node: MarkdownNode, info?: ListInfo) {
	// The list is loose if there is more than one item and the first item's
	// first item is loose
	let loose = false;
	if (node.children?.length) {
		let firstItem = node.children[0];
		if (firstItem.children?.length) {
			if (
				(node.children.length > 1 || firstItem.children.length > 1) &&
				firstItem.children[0].loose
			) {
				loose = true;
			}
		}
	}
	node.loose = loose;

	// You can't start a list with an empty first item
	if (state.hasBlankLine && node.children!.length === 1) {
		let itemNode = node.children![0];
		if (itemNode.children!.length === 0) {
			return false;
		}
	}

	// If there's a blank line after a tight list with more than one child,
	// finish it up
	if (
		!state.openNodes.at(-1)!.acceptsContent &&
		state.hasBlankLine &&
		node.children!.length > 1 &&
		!node.loose
	) {
		return false;
	}

	if (info) {
		if (info.delimiter !== node.delimiter && state.indent < node.subindent) {
			return false;
		}

		// If the list item should be removed, do it but return true so the
		// marker gets checked again
		let index = state.openNodes.indexOf(node) + 1;
		let itemNode = state.openNodes[index];
		if (state.indent < itemNode.column) {
			return false;
		} else if (state.indent < itemNode.subindent) {
			state.openNodes.length = index;
			return true;
		}

		//let spaces = measureSpaces(state.src, state.i);
		//state.i += info.markup.length + spaces;
		//state.indent = state.indent + info.markup.length + spaces;
		return true;
	}

	if (state.hasBlankLine) {
		return true;
	}

	if (state.indent >= node.subindent) {
		return true;
	}

	if (!state.hadBlankLine) {
		return true;
	}

	return false;
}

export default {
	name: "list",
	testStart,
	testContinue,
} satisfies BlockRule;
