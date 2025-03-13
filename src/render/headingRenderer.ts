import type MarkdownNode from "../types/MarkdownNode";
import type RenderState from "../types/RenderState";
import type Renderer from "../types/Renderer";
import endNewLine from "./endNewLine";
import innerNewLine from "./innerNewLine";
import renderChildren from "./renderChildren";
import startNewLine from "./startNewLine";

const name = "heading";

function render(node: MarkdownNode, state: RenderState) {
	startNewLine(node, state);
	let level = node.markup.length;
	state.output += `<h${level}>`;
	innerNewLine(node, state);
	renderChildren(node, state);
	state.output += `</h${level}>`;
	endNewLine(node, state);
}

export default {
	name,
	render,
} satisfies Renderer;
