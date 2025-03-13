import type MidtextNode from "../types/MidtextNode";
import type RenderState from "../types/RenderState";
import type Renderer from "../types/Renderer";

const name = "raw_block";

function render(node: MidtextNode, state: RenderState) {
	state.output += node.content;
}

export default {
	name,
	render,
} satisfies Renderer;
