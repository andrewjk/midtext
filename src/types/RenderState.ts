import type MidtextNode from "./MidtextNode";
import type Renderer from "./Renderer";

export default interface RenderState {
	root: MidtextNode;
	output: string;
	renderers: Map<string, Renderer>;
	/** Unstructured data that can be set and accessed by rules */
	meta: Record<string, any>;
}
