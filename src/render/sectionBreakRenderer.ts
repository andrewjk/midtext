import type MidtextNode from "../types/MidtextNode";
import type RenderState from "../types/RenderState";
import type Renderer from "../types/Renderer";
import renderSelfClosedTag from "./renderSelfClosedTag";

export default {
	name: "section_break",
	render: (node: MidtextNode, state: RenderState) => renderSelfClosedTag(node, state, "hr"),
} satisfies Renderer;
