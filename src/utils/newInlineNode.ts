import type BlockParserState from "../types/BlockParserState";
import type InlineParserState from "../types/InlineParserState";
import type MarkdownNode from "../types/MarkdownNode";

// TODO: Move a lot of functionality into here
// e.g. checking maybeContinue, checking if last node needs closing etc

export default function newInlineNode(
	type: string,
	state: BlockParserState | InlineParserState,
	markup: string,
	indent: number,
	children?: MarkdownNode[],
): MarkdownNode {
	return {
		type,
		block: false,
		offset: state.i,
		line: state.line,
		column: state.i - state.lineStart,
		markup,
		delimiter: "",
		content: "",
		indent,
		subindent: 0,
		children,
	};
}
