import type MarkdownNode from "../types/MarkdownNode";
import type RenderRule from "../types/RenderRule";
import type RenderState from "../types/RenderState";
import renderTag from "./renderTag";

const name = "strong";

function render(node: MarkdownNode, state: RenderState) {
	renderTag(node, state, "strong");
}

export default {
	name,
	render,
} satisfies RenderRule;
