import type MarkdownNode from "../types/MarkdownNode";
import type RenderState from "../types/RenderState";
import type Renderer from "../types/Renderer";
import renderTag from "./renderTag";

const name = "block_quote";

function render(node: MarkdownNode, state: RenderState) {
	renderTag(node, state, "blockquote");
}

export default {
	name,
	render,
} satisfies Renderer;
