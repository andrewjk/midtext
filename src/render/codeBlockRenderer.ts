import type MarkdownNode from "../types/MarkdownNode";
import type RenderRule from "../types/RenderRule";
import type RenderState from "../types/RenderState";
import endNewLine from "./endNewLine";
import renderChildren from "./renderChildren";
import startNewLine from "./startNewLine";

const name = "code_block";

function render(node: MarkdownNode, state: RenderState) {
	startNewLine(node, state);
	let attributes = "";
	if (node.attributes) {
		attributes =
			" " + node.attributes.map((a) => `${a.name}${a.value ? `="${a.value}"` : ""}`).join(" ");
	}
	state.output += `<pre><code${attributes}>`;
	renderChildren(node, state);
	state.output += "</code></pre>";
	endNewLine(node, state);
}

export default {
	name,
	render,
} satisfies RenderRule;
