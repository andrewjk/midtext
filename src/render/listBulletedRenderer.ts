import type MarkdownNode from "../types/MarkdownNode";
import type RenderState from "../types/RenderState";
import type Renderer from "../types/Renderer";
import endNewLine from "./endNewLine";
import innerNewLine from "./innerNewLine";
import renderChildren from "./renderChildren";
import renderNode from "./renderNode";
import startNewLine from "./startNewLine";

const name = "list_bulleted";

function render(node: MarkdownNode, state: RenderState) {
	// TODO: Can we remove paragraphs when parsing instead?

	startNewLine(node, state);
	state.output += "<ul>";
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

	state.output += "</ul>";
	endNewLine(node, state);
}

export default {
	name,
	render,
} satisfies Renderer;
