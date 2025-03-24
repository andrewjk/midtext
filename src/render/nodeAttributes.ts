import type MidtextNode from "../types/MidtextNode";

export default function nodeAttributes(node: MidtextNode) {
	let attributes = "";
	if (node.attributes) {
		attributes +=
			" " + node.attributes.map((a) => `${a.name}${a.value ? `="${a.value}"` : ""}`).join(" ");
	}
	return attributes;
}
