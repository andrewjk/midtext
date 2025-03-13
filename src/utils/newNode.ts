import type MarkdownNode from "../types/MarkdownNode";

// TODO: Move a lot of functionality into here
// e.g. checking maybeContinue, checking if last node needs closing etc

export default function newNode(
	type: string,
	block: boolean,
	index: number,
	line: number,
	column: number,
	markup: string,
	indent: number,
	children?: MarkdownNode[],
): MarkdownNode {
	return {
		type,
		block,
		offset: index,
		line,
		column,
		markup,
		delimiter: "",
		content: "",
		indent,
		subindent: 0,
		children,
	};
}
