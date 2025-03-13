import type MarkdownNode from "../types/MarkdownNode";

export default function newBlockNode(
	type: string,
	offset: number,
	line: number,
	column: number,
	markup: string,
	indent: number,
): MarkdownNode {
	return {
		type,
		block: true,
		offset,
		line,
		column,
		markup,
		delimiter: "",
		content: "",
		indent,
		subindent: 0,
		children: [],
	};
}
