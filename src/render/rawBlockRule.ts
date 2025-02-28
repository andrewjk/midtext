import type MarkdownNode from "../types/MarkdownNode";
import type RenderRule from "../types/RenderRule";
import type RenderState from "../types/RenderState";

const name = "raw_block";

function render(node: MarkdownNode, state: RenderState) {
	state.output += node.content;
}

export default {
	name,
	render,
} satisfies RenderRule;
