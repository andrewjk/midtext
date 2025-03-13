import type MarkdownNode from "./MarkdownNode";
import type RenderState from "./RenderState";

export default interface Renderer {
	name: string;
	render: (node: MarkdownNode, state: RenderState, first?: boolean, last?: boolean) => void;
}
