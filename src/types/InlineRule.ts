import type InlineParserState from "./InlineParserState";

export default interface InlineRule {
	name: string;
	test: (state: InlineParserState) => boolean;
}
