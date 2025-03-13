import type MidtextNode from "../types/MidtextNode";
import type RenderState from "../types/RenderState";
import type Renderer from "../types/Renderer";
import escapeHtml from "../utils/escapeHtml";

const name = "text";

function render(node: MidtextNode, state: RenderState, first?: boolean) {
	let markup = node.markup;
	if (first) {
		markup = markup.trimStart();
	}
	//if (decode) {
	//	markup = decodeEntities(markup);
	//	markup = escapePunctuation(markup);
	//}
	markup = escapeHtml(markup);
	state.output += markup;
}

export default {
	name,
	render,
} satisfies Renderer;
