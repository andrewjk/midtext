import type MidtextNode from "../types/MidtextNode";
import type RenderState from "../types/RenderState";
import type Renderer from "../types/Renderer";
import newDummyNode from "../utils/newDummyNode";
import endNewLine from "./endNewLine";
import startNewLine from "./startNewLine";

function render(node: MidtextNode, state: RenderState) {
	startNewLine(node, state);
	const split = node.info!.indexOf(":");
	const number = node.info!.substring(0, split);
	const label = node.info!.substring(split + 1);
	state.output += `<sup><a id="fn-ref-${number}" href="#fn-${number}">${number}</a></sup>`;
	endNewLine(node, state);

	// TODO: Should probably go backwards
	let list = state.root.children!.find((n) => n.name === "list_ordered" && n.offset === -1);
	if (!list) {
		list = newDummyNode("list_ordered", true);
		list.delimiter = "1";
		list.markup = "1.";
		list.loose = true;
		list.children = [];
		state.root.children!.push(list);
	}

	if (list.children!.find((n) => n.name === "list_item" && n.info === number)) {
		return;
	}

	const returnText = newDummyNode("text", false);
	returnText.markup = "↩︎︎";

	const returnLink = newDummyNode("link", false);
	returnLink.info = `#fn-ref-${number}`;
	returnLink.children = [returnText];

	const ref = state.root.children!.find((n) => n.name === "footnote_ref" && n.info === label)!;
	const lastChild = ref.children!.at(-1)!;

	const spaceText = newDummyNode("text", false);
	spaceText.markup = " ";
	lastChild.children!.push(spaceText, returnLink);

	const listItem = newDummyNode("list_item", true);
	listItem.attributes = [{ name: "id", value: `fn-${number}` }];
	listItem.info = number;
	listItem.children = ref.children;

	list.children!.push(listItem);
}

export default {
	name: "footnote",
	render,
} satisfies Renderer;
