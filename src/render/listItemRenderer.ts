import type MidtextNode from "../types/MidtextNode";
import type RenderState from "../types/RenderState";
import type Renderer from "../types/Renderer";
import renderTag from "./renderTag";

const name = "list_item";

function render(node: MidtextNode, state: RenderState) {
	renderTag(node, state, "li");
}

export default {
	name,
	render,
} satisfies Renderer;
