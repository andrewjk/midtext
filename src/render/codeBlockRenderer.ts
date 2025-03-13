import type MidtextNode from "../types/MidtextNode";
import type RenderState from "../types/RenderState";
import type Renderer from "../types/Renderer";
import endNewLine from "./endNewLine";
import renderChildren from "./renderChildren";
import startNewLine from "./startNewLine";

const name = "code_block";

function render(node: MidtextNode, state: RenderState) {
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
} satisfies Renderer;
