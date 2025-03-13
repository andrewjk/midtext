import type BlockParserState from "../types/BlockParserState";
import type InlineRule from "../types/InlineRule";
import type MidtextNode from "../types/MidtextNode";
import newInlineNode from "../utils/newInlineNode";
import parseInline from "./parseInline";

export default function parseBlockInlines(
	state: BlockParserState,
	parent: MidtextNode,
	rules: Map<string, InlineRule>,
) {
	// Rules that need special text processing can add the text node directly
	// and it won't be processed for inlines
	if (parent.acceptsContent) {
		let textNode = newInlineNode("text", state, parent.content, 0);
		parent.children!.push(textNode);
		return;
	}

	// Recurse through children first, while there are only blocks
	for (let child of parent.children!) {
		parseBlockInlines(state, child, rules);
	}

	// Now add the inlines
	if (parent.content.length) {
		let inlineState = {
			// Strip final spaces before inline parsing
			src: parent.content.trimEnd(),
			rules,
			i: 0,
			line: parent.line,
			lineStart: 0,
			indent: 0,
			delimiters: [],
			refs: state.refs,
		};

		parseInline(inlineState, parent);
	}
}
