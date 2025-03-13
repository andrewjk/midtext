import type MidtextNode from "../types/MidtextNode";
import type RenderState from "../types/RenderState";
import type Renderer from "../types/Renderer";
import listRenderer from "./listRenderer";

const name = "list_ordered";

function render(node: MidtextNode, state: RenderState) {
	listRenderer.render(node, state, true);
}

export default {
	name,
	render,
} satisfies Renderer;
