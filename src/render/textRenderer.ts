import type MidtextNode from "../types/MidtextNode";
import type RenderState from "../types/RenderState";
import type Renderer from "../types/Renderer";
import escapeHtml from "../utils/escapeHtml";

function render(node: MidtextNode, state: RenderState, first?: boolean) {
	let markup = node.markup;
	if (first) {
		markup = markup.trimStart();
	}
	markup = escapeHtml(markup);
	state.output += markup;
}

export default {
	name: "text",
	render,
} satisfies Renderer;
