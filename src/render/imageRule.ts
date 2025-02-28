import type MarkdownNode from "../types/MarkdownNode";
import type RenderRule from "../types/RenderRule";
import type RenderState from "../types/RenderState";
import endNewLine from "./endNewLine";
import startNewLine from "./startNewLine";

const name = "image";

function render(node: MarkdownNode, state: RenderState) {
	startNewLine(node, state);
	let alt = getChildText(node);
	let title = /*node.title ? ` title="${node.title}"` :*/ "";
	state.output += `<img src="${node.info}" alt="${alt}"${title} />`;
	endNewLine(node, state);
}

function getChildText(node: MarkdownNode) {
	let text = "";
	if (node.children) {
		for (let child of node.children) {
			if (child.type === "text") {
				text += child.markup;
			} else {
				text += getChildText(child);
			}
		}
	}
	return text;
}

export default {
	name,
	render,
} satisfies RenderRule;
