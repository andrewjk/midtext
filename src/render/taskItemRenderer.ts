import type MidtextNode from "../types/MidtextNode";
import type RenderState from "../types/RenderState";
import type Renderer from "../types/Renderer";

const name = "task_item";

function render(node: MidtextNode, state: RenderState) {
	let checked =
		node.markup[1] === "-" ? ` checked indeterminate` : node.markup[1] === "x" ? ` checked` : ``;
	state.output += `<input type="checkbox" disabled${checked} /> `;
}

export default {
	name,
	render,
} satisfies Renderer;
