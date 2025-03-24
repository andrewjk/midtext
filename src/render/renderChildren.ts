import type MidtextNode from "../types/MidtextNode";
import type RenderState from "../types/RenderState";
import renderNode from "./renderNode";

export default function renderChildren(node: MidtextNode, state: RenderState) {
	let children = node.children;
	if (children && children.length) {
		let trim = !node.acceptsContent;
		for (let [i, child] of children.entries()) {
			let first = i === 0;
			let last = i === children.length - 1;
			renderNode(child, state, trim && first, trim && last);
		}
	}
}
