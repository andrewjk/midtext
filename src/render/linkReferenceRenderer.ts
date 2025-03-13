import type MarkdownNode from "../types/MarkdownNode";
import type RenderState from "../types/RenderState";
import type Renderer from "../types/Renderer";

const name = "link_ref";

function render(node: MarkdownNode, state: RenderState) {
	// Ignore this one
}

export default {
	name,
	render,
} satisfies Renderer;
