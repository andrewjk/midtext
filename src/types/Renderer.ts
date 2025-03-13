import type MidtextNode from "./MidtextNode";
import type RenderState from "./RenderState";

export default interface Renderer {
	name: string;
	render: (node: MidtextNode, state: RenderState, first?: boolean, last?: boolean) => void;
}
