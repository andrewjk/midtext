import type MidtextNode from "../types/MidtextNode";
import type RenderState from "../types/RenderState";

export default function innerNewLine(node: MidtextNode, state: RenderState) {
	if (node.block && node.children && node.children[0]?.block) {
		state.output += "\n";
	}
}
