import type BlockParserState from "../types/BlockParserState";
import type InlineParserState from "../types/InlineParserState";
import type MarkdownNode from "../types/MarkdownNode";
import newNode from "../utils/newNode";
import parseInline from "./parseInline";

export default function parseBlockInlines(
	state: BlockParserState,
	parent: MarkdownNode,
	refs: Record<string, string>,
) {
	// Rules that need special text processing can add the text node directly
	// and it won't be processed for inlines
	if (parent.acceptsContent) {
		let textNode = newNode("text", false, parent.offset, parent.line, 1, parent.content, 0);
		parent.children!.push(textNode);
		return;
	}

	// Recurse through children first, while there are only blocks
	for (let child of parent.children!) {
		parseBlockInlines(state, child, refs);
	}

	// Now add the inlines
	if (parent.content.length) {
		let state: InlineParserState = {
			// Strip final spaces before inline parsing
			src: parent.content.trimEnd(),
			i: 0,
			line: parent.line,
			lineStart: 0,
			indent: 0,
			delimiters: [],
			refs,
		};

		parseInline(state, parent);
	}
}
