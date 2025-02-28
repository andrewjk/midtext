import type RenderRule from "./RenderRule";

export default interface RenderState {
	output: string;
	rules: Map<string, RenderRule>;
}
