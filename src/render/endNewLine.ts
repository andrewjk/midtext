import type MarkdownNode from "../types/MarkdownNode";
import type RenderState from "../types/RenderState";

export default function endNewLine(node: MarkdownNode, state: RenderState) {
	if (node.block) {
		state.output += "\n";
	}
}
