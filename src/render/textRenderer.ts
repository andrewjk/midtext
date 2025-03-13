import type MarkdownNode from "../types/MarkdownNode";
import type RenderRule from "../types/RenderRule";
import type RenderState from "../types/RenderState";
import escapeHtml from "../utils/escapeHtml";

const name = "text";

function render(node: MarkdownNode, state: RenderState, first?: boolean) {
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
} satisfies RenderRule;
