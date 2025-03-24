import type MidtextNode from "../types/MidtextNode";
import type RenderState from "../types/RenderState";
import type Renderer from "../types/Renderer";

const name = "footnote_ref";

function render(node: MidtextNode, state: RenderState) {
	// Ignore this one
}

export default {
	name,
	render,
} satisfies Renderer;
