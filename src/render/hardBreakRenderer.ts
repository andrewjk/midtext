import type MidtextNode from "../types/MidtextNode";
import type RenderState from "../types/RenderState";
import type Renderer from "../types/Renderer";

function render(node: MidtextNode, state: RenderState) {
	state.output += "<br />\n";
}

export default {
	name: "hard_break",
	render,
} satisfies Renderer;
