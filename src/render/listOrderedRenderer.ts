import type MidtextNode from "../types/MidtextNode";
import type RenderState from "../types/RenderState";
import type Renderer from "../types/Renderer";
import { listRender } from "./listRenderer";

function render(node: MidtextNode, state: RenderState) {
	listRender(node, state, true);
}

export default {
	name: "list_ordered",
	render,
} satisfies Renderer;
