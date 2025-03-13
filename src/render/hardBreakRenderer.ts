import type MarkdownNode from "../types/MarkdownNode";
import type RenderRule from "../types/RenderRule";
import type RenderState from "../types/RenderState";

const name = "hard_break";

function render(node: MarkdownNode, state: RenderState) {
	state.output += "<br />\n";
}

export default {
	name,
	render,
} satisfies RenderRule;
