import type MarkdownNode from "../types/MarkdownNode";
import type RenderState from "../types/RenderState";
import type Renderer from "../types/Renderer";
import renderChildren from "./renderChildren";

const name = "document";

function render(node: MarkdownNode, state: RenderState) {
	renderChildren(node, state);
}

export default {
	name,
	render,
} satisfies Renderer;
