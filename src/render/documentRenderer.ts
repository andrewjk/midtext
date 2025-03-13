import type MidtextNode from "../types/MidtextNode";
import type RenderState from "../types/RenderState";
import type Renderer from "../types/Renderer";
import renderChildren from "./renderChildren";

const name = "document";

function render(node: MidtextNode, state: RenderState) {
	renderChildren(node, state);
}

export default {
	name,
	render,
} satisfies Renderer;
