import type BlockParserState from "../types/BlockParserState";

export default function evictBlocks(state: BlockParserState) {
	let i = state.openNodes.length;
	while (i-- > 1) {
		let node = state.openNodes[i];
		if (state.indent < node.subindent || node.type === "paragraph") {
			state.openNodes.length = i;
		}
	}
}
