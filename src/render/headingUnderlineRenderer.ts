import type MarkdownNode from "../types/MarkdownNode";
import type RenderRule from "../types/RenderRule";
import type RenderState from "../types/RenderState";
import endNewLine from "./endNewLine";
import innerNewLine from "./innerNewLine";
import renderChildren from "./renderChildren";
import startNewLine from "./startNewLine";

const name = "heading_underline";

function render(node: MarkdownNode, state: RenderState) {
	startNewLine(node, state);
	let level = node.markup.includes("=") ? 1 : 2;
	state.output += `<h${level}>`;
	innerNewLine(node, state);
	renderChildren(node, state);
	state.output += `</h${level}>`;
	endNewLine(node, state);
}

export default {
	name,
	render,
} satisfies RenderRule;
