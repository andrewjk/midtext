import type MidtextNode from "../types/MidtextNode";
import type RenderState from "../types/RenderState";
import type Renderer from "../types/Renderer";
import endNewLine from "./endNewLine";
import renderChildren from "./renderChildren";
import startNewLine from "./startNewLine";

const name = "link";

function render(node: MidtextNode, state: RenderState) {
	startNewLine(node, state);
	let title = /* node.title ? ` title="${node.title}"` :*/ "";
	state.output += `<a href="${node.info}"${title}>`;
	renderChildren(node, state);
	state.output += "</a>";
	endNewLine(node, state);
}

export default {
	name,
	render,
} satisfies Renderer;
