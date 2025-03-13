import type MarkdownNode from "../types/MarkdownNode";
import type RenderState from "../types/RenderState";
import type Renderer from "../types/Renderer";
import renderTag from "./renderTag";

const name = "strong_emphasis";

function render(node: MarkdownNode, state: RenderState) {
	state.output += "<em>";
	renderTag(node, state, "strong");
	state.output += "</em>";
}

export default {
	name,
	render,
} satisfies Renderer;
