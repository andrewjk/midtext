import type MarkdownNode from "../types/MarkdownNode";
import type RenderState from "../types/RenderState";
import endNewLine from "./endNewLine";
import innerNewLine from "./innerNewLine";
import renderChildren from "./renderChildren";
import startNewLine from "./startNewLine";

export default function renderTag(node: MarkdownNode, state: RenderState, tag: string) {
	startNewLine(node, state);
	state.output += `<${tag}`;
	if (node.attributes) {
		state.output +=
			" " + node.attributes.map((a) => `${a.name}${a.value ? `="${a.value}"` : ""}`).join(" ");
	}
	state.output += ">";
	innerNewLine(node, state);
	renderChildren(node, state);
	state.output += `</${tag}>`;
	endNewLine(node, state);
}
