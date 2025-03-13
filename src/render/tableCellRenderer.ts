import type MidtextNode from "../types/MidtextNode";
import type RenderState from "../types/RenderState";
import type Renderer from "../types/Renderer";
import renderTag from "./renderTag";

const name = "table_cell";

function render(node: MidtextNode, state: RenderState) {
	renderTag(node, state, "td");
}

export default {
	name,
	render,
} satisfies Renderer;
