import type MarkdownNode from "../types/MarkdownNode";
import type RenderState from "../types/RenderState";
import renderTag from "./renderTag";

export default function renderNode(
	node: MarkdownNode,
	state: RenderState,
	first = false,
	last = false,
) {
	let rule = state.renderers.get(node.type);
	if (rule) {
		rule.render(node, state, first, last);
	} else {
		renderTag(node, state, node.type);
	}
}
