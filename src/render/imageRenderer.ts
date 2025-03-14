import type MidtextNode from "../types/MidtextNode";
import type RenderState from "../types/RenderState";
import type Renderer from "../types/Renderer";
import endNewLine from "./endNewLine";
import startNewLine from "./startNewLine";

const name = "image";

function render(node: MidtextNode, state: RenderState) {
	startNewLine(node, state);
	let alt = getChildText(node);
	state.output += `<img src="${node.info}" alt="${alt}" />`;
	endNewLine(node, state);
}

function getChildText(node: MidtextNode) {
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
} satisfies Renderer;
