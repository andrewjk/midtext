import type MidtextNode from "../types/MidtextNode";
import type RenderState from "../types/RenderState";
import type Renderer from "../types/Renderer";
import endNewLine from "./endNewLine";
import innerNewLine from "./innerNewLine";
import nodeAttributes from "./nodeAttributes";
import renderChildren from "./renderChildren";
import startNewLine from "./startNewLine";

function render(node: MidtextNode, state: RenderState) {
	startNewLine(node, state);
	state.output += `<table${nodeAttributes(node)}>\n<thead>\n<tr>\n`;
	for (let cell of node.children![0].children!) {
		renderTableCell(cell, state, "th");
	}
	state.output += "</tr>\n</thead>\n";
	if (node.children!.length > 1) {
		state.output += "<tbody>\n";
		for (let row of node.children!.slice(1)) {
			state.output += "<tr>\n";
			for (let cell of row.children!) {
				renderTableCell(cell, state, "td");
			}
			state.output += "</tr>\n";
		}
		state.output += "</tbody>\n";
	}
	state.output += "</table>";
	endNewLine(node, state);
}

function renderTableCell(node: MidtextNode, state: RenderState, tag: string) {
	startNewLine(node, state);
	let align = node.info ? ` align="${node.info}"` : "";
	state.output += `<${tag}${align}>`;
	innerNewLine(node, state);
	renderChildren(node, state);
	state.output += `</${tag}>`;
	endNewLine(node, state);
}

export default {
	name: "table",
	render,
} satisfies Renderer;
