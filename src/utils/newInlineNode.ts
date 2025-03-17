import type InlineParserState from "../types/InlineParserState";
import type MidtextNode from "../types/MidtextNode";

export default function newInlineNode(
	type: string,
	state: InlineParserState,
	offset: number,
	line: number,
	markup: string,
	indent: number,
): MidtextNode {
	return {
		type,
		block: false,
		offset: offset + state.offset,
		line,
		column: offset + (line > state.line ? -state.lineStarts[line - state.line - 1] : state.column),
		markup,
		delimiter: "",
		content: "",
		indent,
		subindent: 0,
		children: [],
	};
}
