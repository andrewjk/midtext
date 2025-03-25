import type MidtextNode from "../types/MidtextNode";
import type RenderState from "../types/RenderState";
import type Renderer from "../types/Renderer";
import renderTag from "./renderTag";

export default {
	name: "strong",
	render: (node: MidtextNode, state: RenderState) => renderTag(node, state, "strong"),
} satisfies Renderer;
