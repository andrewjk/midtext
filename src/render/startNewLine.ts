import type MidtextNode from "../types/MidtextNode";
import type RenderState from "../types/RenderState";

export default function startNewLine(node: MidtextNode, state: RenderState) {
	if (state.output.length && node.block && !state.output.endsWith("\n")) {
		state.output += "\n";
	}
}
