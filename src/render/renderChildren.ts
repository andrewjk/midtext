import type MarkdownNode from "../types/MarkdownNode";
import type RenderState from "../types/RenderState";
import renderNode from "./renderNode";

export default function renderChildren(node: MarkdownNode, state: RenderState) {
	let children = node.children;
	if (children && children.length) {
		let trim =
			node.type !== "code_block" &&
			node.type !== "raw_block" &&
			node.type !== "code_span" &&
			node.type !== "raw_span";
		for (let [i, child] of children.entries()) {
			let first = i === 0;
			let last = i === children.length - 1;
			renderNode(child, state, trim && first, trim && last);
		}
	}
}
