import type MarkdownNode from "../types/MarkdownNode";
import type RenderState from "../types/RenderState";
import type Renderer from "../types/Renderer";

const name = "hard_break";

function render(node: MarkdownNode, state: RenderState) {
	state.output += "<br />\n";
}

export default {
	name,
	render,
} satisfies Renderer;
