import type MidtextNode from "../types/MidtextNode";
import type RenderState from "../types/RenderState";
import endNewLine from "./endNewLine";
import startNewLine from "./startNewLine";

export default function renderSelfClosedTag(node: MidtextNode, state: RenderState, tag: string) {
	startNewLine(node, state);
	state.output += `<${tag} />`;
	endNewLine(node, state);
}
