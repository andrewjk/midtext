import type MarkdownNode from "../types/MarkdownNode";
import type RenderRule from "../types/RenderRule";
import type RenderState from "../types/RenderState";
import endNewLine from "./endNewLine";
import innerNewLine from "./innerNewLine";
import renderChildren from "./renderChildren";
import renderNode from "./renderNode";
import startNewLine from "./startNewLine";

const name = "list_ordered";

function render(node: MarkdownNode, state: RenderState) {
	// TODO: Can we remove paragraphs when parsing instead?

	let start = "";
	if (node.delimiter === "1") {
		let startNumber = parseInt(node.markup.substring(0, node.markup.length - 1));
		if (startNumber !== 1) {
			start = ` start="${startNumber}"`;
		}
	} else {
		let startAlpha = node.markup.substring(0, node.markup.length - 1).toLowerCase();
		start = ` type="${node.delimiter}"`;
		if (startAlpha !== "a") {
			start += ` start="${"-abcdefghijklmnopqrstuvwxyz".indexOf(startAlpha)}"`;
		}
	}

	startNewLine(node, state);
	state.output += `<ol${start}>`;
	innerNewLine(node, state);

	// "A list is loose if any of its constituent list items are separated by
	// blank lines, or if any of its constituent list items directly contain two
	// block-level elements with a blank line between them. Otherwise a list is
	// tight."

	let loose = false;
	if (node.children?.length) {
		let firstItem = node.children[0];
		if (firstItem.children?.length) {
			if (
				(node.children.length > 1 || firstItem.children.length > 1) &&
				firstItem.children[0].loose
			) {
				loose = true;
			}
		}
	}

	for (let item of node.children!) {
		state.output += "<li>";
		for (let [i, child] of item.children!.entries()) {
			if (!loose && child.type === "paragraph") {
				// Skip paragraphs under list items to make the list tight
				renderChildren(child, state);
			} else {
				if (i === 0) {
					innerNewLine(item, state);
				}
				renderNode(child, state, i === item.children!.length - 1);
			}
		}
		state.output += "</li>";
		endNewLine(node, state);
	}

	state.output += "</ol>";
	endNewLine(node, state);
}

export default {
	name,
	render,
} satisfies RenderRule;
