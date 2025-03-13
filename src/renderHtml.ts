import defaultRenderers from "./defaultRenderers";
import renderNode from "./render/renderNode";
import type MidtextNode from "./types/MidtextNode";
import type Renderer from "./types/Renderer";

export default function renderHtml(root: MidtextNode, renderers?: Map<string, Renderer>): string {
	renderers ??= defaultRenderers();

	let state = { output: "", renderers };

	renderNode(root, state);

	return state.output;
}
