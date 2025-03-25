import type MidtextNode from "../types/MidtextNode";
import type RenderState from "../types/RenderState";
import type Renderer from "../types/Renderer";
import renderTag from "./renderTag";

export default {
	name: "heading_underline",
	render: (node: MidtextNode, state: RenderState) =>
		renderTag(node, state, `h${node.markup.includes("=") ? 1 : 2}`),
} satisfies Renderer;
