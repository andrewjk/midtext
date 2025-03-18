import type MidtextNode from "../types/MidtextNode";
import type RenderState from "../types/RenderState";
import type Renderer from "../types/Renderer";
import renderTag from "./renderTag";

const name = "heading";

function render(node: MidtextNode, state: RenderState) {
	let level = node.markup.length;
	renderTag(node, state, `h${level}`);
}

export default {
	name,
	render,
} satisfies Renderer;
