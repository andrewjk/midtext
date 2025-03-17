import type InlineParserState from "../types/InlineParserState";
import type MidtextNode from "../types/MidtextNode";

export default function newInlineNode(
	name: string,
	state: InlineParserState,
	markup: string,
	offset: number,
	line: number,
): MidtextNode {
	return {
		name,
		block: false,
		offset: offset + state.offset,
		line,
		column: offset + (line > state.line ? -state.lineStarts[line - state.line - 1] : state.column),
		markup,
		delimiter: "",
		content: "",
		indent: 0,
		subindent: 0,
		children: [],
	};
}
