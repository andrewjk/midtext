import type MarkdownNode from "../types/MarkdownNode";
import type RenderRule from "../types/RenderRule";
import type RenderState from "../types/RenderState";
import renderChildren from "./renderChildren";

const name = "document";

function render(node: MarkdownNode, state: RenderState) {
	renderChildren(node, state);
}

export default {
	name,
	render,
} satisfies RenderRule;
