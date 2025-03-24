import type MidtextNode from "../types/MidtextNode";
import type RenderState from "../types/RenderState";
import endNewLine from "./endNewLine";
import innerNewLine from "./innerNewLine";
import nodeAttributes from "./nodeAttributes";
import renderChildren from "./renderChildren";
import startNewLine from "./startNewLine";

export default function renderTag(node: MidtextNode, state: RenderState, tag: string) {
	startNewLine(node, state);
	state.output += `<${tag}${nodeAttributes(node)}>`;
	innerNewLine(node, state);
	renderChildren(node, state);
	state.output += `</${tag}>`;
	endNewLine(node, state);
}
