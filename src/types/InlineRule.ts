import type InlineParserState from "./InlineParserState";
import type MidtextNode from "./MidtextNode";

export default interface InlineRule {
	name: string;
	test: (state: InlineParserState, parent: MidtextNode, end: number) => boolean;
}
