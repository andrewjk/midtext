import type BlockParserState from "../types/BlockParserState";
import type InlineParserState from "../types/InlineParserState";
import type InlineRule from "../types/InlineRule";
import type MidtextNode from "../types/MidtextNode";
import parseInline from "./parseInline";

export default function parseBlockInlines(
	state: BlockParserState,
	parent: MidtextNode,
	rules: Map<string, InlineRule>,
) {
	// Rules that need special text processing can add the text node directly
	// and it won't be processed for inlines
	if (parent.acceptsContent) {
		let textNode: MidtextNode = {
			name: "text",
			block: false,
			offset: state.i,
			line: state.line,
			column: state.column,
			markup: parent.content,
			delimiter: "",
			content: "",
			indent: 0,
			subindent: 0,
			children: [],
		};
		parent.children!.push(textNode);
		return;
	}

	// Recurse through children first, while there are only blocks
	for (let child of parent.children!) {
		parseBlockInlines(state, child, rules);
	}

	// Now add the inlines
	if (parent.content.length) {
		let inlineState: InlineParserState = {
			// Strip final spaces before inline parsing
			src: parent.content.trimEnd(),
			rules,
			i: 0,
			offset: parent.offset + (parent.subindent - parent.indent),
			line: parent.line,
			column: parent.subindent,
			lineStarts: [],
			indent: 0,
			delimiters: [],
			refs: state.refs,
		};

		parseInline(inlineState, parent);
	}
}
