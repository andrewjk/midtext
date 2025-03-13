import type BlockParserState from "../types/BlockParserState";
import type MarkdownNode from "../types/MarkdownNode";

export default function newBlockNode(
	type: string,
	state: BlockParserState,
	markup: string,
	indent: number,
	subindent: number,
): MarkdownNode {
	let node = {
		type,
		block: true,
		offset: state.i,
		line: state.line,
		column: state.i - state.lineStart,
		markup,
		delimiter: "",
		content: "",
		indent,
		subindent,
		children: [],
		attributes: state.attributes,
	};
	state.attributes = undefined;
	return node;
}
