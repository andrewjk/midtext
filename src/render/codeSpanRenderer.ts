import type MarkdownNode from "../types/MarkdownNode";
import type RenderState from "../types/RenderState";
import type Renderer from "../types/Renderer";
import renderTag from "./renderTag";

const name = "code_span";

function render(node: MarkdownNode, state: RenderState) {
	renderTag(node, state, "code");
}

export default {
	name,
	render,
} satisfies Renderer;
