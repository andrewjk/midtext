import type MidtextNode from "../types/MidtextNode";
import type RenderState from "../types/RenderState";
import renderTag from "./renderTag";

export default function renderNode(
	node: MidtextNode,
	state: RenderState,
	first = false,
	last = false,
) {
	let rule = state.renderers.get(node.name);
	if (rule) {
		rule.render(node, state, first, last);
	} else {
		renderTag(node, state, node.name);
	}
}
