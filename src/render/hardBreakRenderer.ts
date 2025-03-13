import type MidtextNode from "../types/MidtextNode";
import type RenderState from "../types/RenderState";
import type Renderer from "../types/Renderer";

const name = "hard_break";

function render(node: MidtextNode, state: RenderState) {
	state.output += "<br />\n";
}

export default {
	name,
	render,
} satisfies Renderer;
