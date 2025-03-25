import type MidtextNode from "../types/MidtextNode";
import type RenderState from "../types/RenderState";
import type Renderer from "../types/Renderer";

export default {
	name: "raw_span",
	render: (node: MidtextNode, state: RenderState) => (state.output += node.children![0].markup),
} satisfies Renderer;
