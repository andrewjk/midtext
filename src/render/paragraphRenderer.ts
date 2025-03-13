import type MidtextNode from "../types/MidtextNode";
import type RenderState from "../types/RenderState";
import type Renderer from "../types/Renderer";
import renderTag from "./renderTag";

const name = "paragraph";

function render(node: MidtextNode, state: RenderState) {
	renderTag(node, state, "p");
}

export default {
	name,
	render,
} satisfies Renderer;
