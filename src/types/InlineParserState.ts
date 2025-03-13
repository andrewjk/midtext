import type Delimiter from "./Delimiter";
import type InlineRule from "./InlineRule";

export default interface InlineParserState {
	src: string;
	rules: Map<string, InlineRule>;
	i: number;
	line: number;
	lineStart: number;
	indent: number;
	delimiters: Delimiter[];
	refs: Record<string, string>;
}
