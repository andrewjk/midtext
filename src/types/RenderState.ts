import type Renderer from "./Renderer";

export default interface RenderState {
	output: string;
	renderers: Map<string, Renderer>;
}
