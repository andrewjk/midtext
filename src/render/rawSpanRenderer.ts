import type MarkdownNode from "../types/MarkdownNode";
import type RenderState from "../types/RenderState";
import type Renderer from "../types/Renderer";

const name = "raw_span";

function render(node: MarkdownNode, state: RenderState) {
	state.output += node.children![0].markup;
}

export default {
	name,
	render,
} satisfies Renderer;
