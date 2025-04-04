import type MidtextNode from "../types/MidtextNode";
import type RenderState from "../types/RenderState";
import type Renderer from "../types/Renderer";
import renderTag from "./renderTag";

function render(node: MidtextNode, state: RenderState) {
	state.output += "<em>";
	renderTag(node, state, "strong");
	state.output += "</em>";
}

export default {
	name: "strong_emphasis",
	render,
} satisfies Renderer;
