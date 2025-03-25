import type MidtextNode from "../types/MidtextNode";
import type RenderState from "../types/RenderState";
import type Renderer from "../types/Renderer";

export default {
	name: "raw_block",
	render: (node: MidtextNode, state: RenderState) => (state.output += node.content),
} satisfies Renderer;
