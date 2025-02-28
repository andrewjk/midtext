import type MarkdownNode from "../types/MarkdownNode";
import type RenderState from "../types/RenderState";

export default function innerNewLine(node: MarkdownNode, state: RenderState) {
	if (node.block && node.children && node.children[0]?.block) {
		state.output += "\n";
	}
}
