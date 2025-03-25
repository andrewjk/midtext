import parseBlock from "../parse/parseBlock";
import type BlockParserState from "../types/BlockParserState";
import type MidtextNode from "../types/MidtextNode";
import checkBlankLineBefore from "../utils/checkBlankLineBefore";
import countSpaces from "../utils/countSpaces";
import evictBlocksForNestableNode from "../utils/evictBlocksForNestableNode";
import isNewLine from "../utils/isNewLine";
import newBlockNode from "../utils/newBlockNode";

export interface ListInfo {
	delimiter: string;
	markup: string;
	isBlank: boolean;
	name: string;
}

export function listTestStart(state: BlockParserState, info?: ListInfo) {
	if (info) {
		const name = info.name;

		let spaces = countSpaces(state.src, state.i + info.markup.length);
		let subindent = state.indent + info.markup.length + spaces;

		// If it's an empty item, set its content start to just after the marker
		let isEmpty = isNewLine(state.src[state.i + info.markup.length + spaces]);
		if (isEmpty) {
			subindent = state.indent + info.markup.length;
		}

		// Close blocks that this node shouldn't be nested under
		evictBlocksForNestableNode(state, name);

		// Create the node
		let parent = state.openNodes.at(-1)!;
		let haveNode = parent.name === name;

		// Create the new item
		let itemNode = newBlockNode("list_item", state, info.markup, state.indent, subindent);

		// Create or continue the list
		let listNode = haveNode
			? parent
			: newBlockNode(name, state, info.markup, state.indent, subindent);
		listNode.delimiter = itemNode.delimiter = info.delimiter;
		listNode.children!.push(itemNode);
		if (!haveNode) {
			parent.children!.push(listNode);
			state.openNodes.push(listNode);
			state.openNodes.push(itemNode);
		} else {
			state.openNodes.push(itemNode);
		}

		if (haveNode) {
			checkBlankLineBefore(state, itemNode, listNode);
			if (itemNode.blankBefore) {
				parent.loose = true;
			}
		} else {
			checkBlankLineBefore(state, listNode, parent);
		}

		// Parse children
		state.i += info.markup.length + spaces;
		state.indent = subindent;
		parseBlock(state, state.openNodes.length - 1);

		return true;
	}

	return false;
}

export function listTestContinue(
	state: BlockParserState,
	node: MidtextNode,
	hadBlankLine: boolean,
	info?: ListInfo,
) {
	// You can't start a list with an empty first item
	if (state.atLineEnd && node.children!.length === 1) {
		let itemNode = node.children![0];
		if (itemNode.children!.length === 0) {
			return false;
		}
	}

	// If there's a blank line after a tight list with more than one child,
	// finish it up
	if (
		!state.openNodes.at(-1)!.acceptsContent &&
		state.atLineEnd &&
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

	if (state.atLineEnd) {
		return true;
	}

	if (state.indent >= node.subindent) {
		return true;
	}

	if (!hadBlankLine) {
		return true;
	}

	return false;
}
