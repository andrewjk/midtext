import type BlockParserState from "../types/BlockParserState";
import type MidtextNode from "../types/MidtextNode";

export default function newBlockNode(
	name: string,
	state: BlockParserState,
	markup: string,
	indent: number,
	subindent: number,
): MidtextNode {
	let node = {
		name,
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
