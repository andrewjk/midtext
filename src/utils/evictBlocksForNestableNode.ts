import type BlockParserState from "../types/BlockParserState";

export default function evictBlocksForNestableNode(state: BlockParserState, name: string) {
	let i = state.openNodes.length;
	while (i-- > 1) {
		let node = state.openNodes[i];
		if (
			(state.indent < node.subindent && node.line !== state.line && node.name !== name) ||
			node.name === "paragraph"
		) {
			state.openNodes.length = i;
		}
	}
}
