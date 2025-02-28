import type MarkdownNode from "../types/MarkdownNode";
import type RenderRule from "../types/RenderRule";
import type RenderState from "../types/RenderState";

const name = "raw_span";

function render(node: MarkdownNode, state: RenderState) {
	state.output += node.children![0].markup;
}

export default {
	name,
	render,
} satisfies RenderRule;
