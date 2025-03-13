import type BlockParserState from "../types/BlockParserState";
import type MidtextNode from "../types/MidtextNode";

export default function checkBlankLineBefore(
	state: BlockParserState,
	node: MidtextNode,
	parent: MidtextNode,
) {
	let level = state.openNodes.indexOf(parent);
	if (state.blankLevel !== -1 && state.blankLevel <= level) {
		node.blankBefore = true;
		state.blankLevel = -1;
	}
}
