import type InlineParserState from "./InlineParserState";
import type MarkdownNode from "./MarkdownNode";

export default interface InlineRule {
	name: string;
	test: (state: InlineParserState, parent: MarkdownNode, end: number) => boolean;
}
