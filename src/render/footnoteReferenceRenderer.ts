import type MidtextNode from "../types/MidtextNode";
import type RenderState from "../types/RenderState";
import type Renderer from "../types/Renderer";

export default {
	name: "footnote_ref",
	render: (node: MidtextNode, state: RenderState) => {},
} satisfies Renderer;
