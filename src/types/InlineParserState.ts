import type Delimiter from "./Delimiter";
import type InlineRule from "./InlineRule";

export default interface InlineParserState {
	src: string;
	rules: Map<string, InlineRule>;
	i: number;
	offset: number;
	line: number;
	column: number;
	// HACK: Don't love this but it's the easiest way to get line positioning done
	lineStarts: number[];
	indent: number;
	delimiters: Delimiter[];
	refs: Record<string, string>;
}
