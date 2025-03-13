import type MarkdownNode from "../types/MarkdownNode";
import type RenderRule from "../types/RenderRule";
import type RenderState from "../types/RenderState";

const name = "link_ref";

function render(node: MarkdownNode, state: RenderState) {
	// Ignore this one
}

export default {
	name,
	render,
} satisfies RenderRule;
