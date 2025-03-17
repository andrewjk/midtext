import type MidtextNode from "../types/MidtextNode";
import type RenderState from "../types/RenderState";
import type Renderer from "../types/Renderer";
import endNewLine from "./endNewLine";
import innerNewLine from "./innerNewLine";
import renderChildren from "./renderChildren";
import renderNode from "./renderNode";
import startNewLine from "./startNewLine";

function render(node: MidtextNode, state: RenderState, ordered?: boolean) {
	// TODO: Can we remove paragraphs when parsing instead?

	startNewLine(node, state);

	let start = "";
	if (ordered) {
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
		state.output += `<ol${start}>`;
	} else {
		state.output += "<ul>";
	}

	innerNewLine(node, state);

	// "A list is loose if any of its constituent list items are separated by
	// blank lines, or if any of its constituent list items directly contain two
	// block-level elements with a blank line between them. Otherwise a list is
	// tight."

	// HACK: We need to be closing stuff
	let loose = node.loose;
	if (node.children!.length === 1) {
		let item = node.children![0];
		if (item.children!.length > 1) {
			loose = item.children?.at(-1)!.blankBefore;
		}
	}

	for (let item of node.children!) {
		state.output += "<li>";
		for (let [i, child] of item.children!.entries()) {
			if (!loose && child.name === "paragraph") {
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

	state.output += ordered ? "</ol>" : "</ul>";
	endNewLine(node, state);
}

export default {
	name: "list",
	render,
} satisfies Renderer;
