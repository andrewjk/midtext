import type MarkdownNode from "../types/MarkdownNode";
import type RenderRule from "../types/RenderRule";
import type RenderState from "../types/RenderState";
import renderTag from "./renderTag";

const name = "superscript";

function render(node: MarkdownNode, state: RenderState) {
	renderTag(node, state, "sup");
}

export default {
	name,
	render,
} satisfies RenderRule;
