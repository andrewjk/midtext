import type MarkdownNode from "../types/MarkdownNode";
import type RenderRule from "../types/RenderRule";
import type RenderState from "../types/RenderState";
import endNewLine from "./endNewLine";
import renderChildren from "./renderChildren";
import startNewLine from "./startNewLine";

const name = "link";

function render(node: MarkdownNode, state: RenderState) {
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
} satisfies RenderRule;
