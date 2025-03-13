import type MarkdownNode from "../types/MarkdownNode";
import type RenderRule from "../types/RenderRule";
import type RenderState from "../types/RenderState";
import renderSelfClosedTag from "./renderSelfClosedTag";

const name = "section_break";

function render(node: MarkdownNode, state: RenderState) {
	renderSelfClosedTag(node, state, "hr");
}

export default {
	name,
	render,
} satisfies RenderRule;
