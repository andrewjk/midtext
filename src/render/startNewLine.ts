import type MarkdownNode from "../types/MarkdownNode";
import type RenderState from "../types/RenderState";

export default function startNewLine(node: MarkdownNode, state: RenderState) {
	if (state.output.length && node.block && !state.output.endsWith("\n")) {
		state.output += "\n";
	}
}
