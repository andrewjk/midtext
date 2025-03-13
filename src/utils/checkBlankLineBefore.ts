import type BlockParserState from "../types/BlockParserState";
import type MarkdownNode from "../types/MarkdownNode";

export default function checkBlankLineBefore(
	state: BlockParserState,
	node: MarkdownNode,
	parent: MarkdownNode,
) {
	let level = state.openNodes.indexOf(parent);
	if (state.blankLevel !== -1 && state.blankLevel <= level) {
		node.blankBefore = true;
		state.blankLevel = -1;
	}
}
