import type MidtextNode from "../types/MidtextNode";
import type RenderState from "../types/RenderState";
import type Renderer from "../types/Renderer";
import endNewLine from "./endNewLine";
import nodeAttributes from "./nodeAttributes";
import renderChildren from "./renderChildren";
import startNewLine from "./startNewLine";

function render(node: MidtextNode, state: RenderState) {
	startNewLine(node, state);
	state.output += `<pre><code${nodeAttributes(node)}>`;
	renderChildren(node, state);
	state.output += "</code></pre>";
	endNewLine(node, state);
}

export default {
	name: "code_block",
	render,
} satisfies Renderer;
