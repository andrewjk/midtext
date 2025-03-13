import type MidtextNode from "../types/MidtextNode";
import type RenderState from "../types/RenderState";

export default function endNewLine(node: MidtextNode, state: RenderState) {
	if (node.block) {
		state.output += "\n";
	}
}
