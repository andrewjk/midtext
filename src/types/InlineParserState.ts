import type Delimiter from "./Delimiter";

export default interface InlineParserState {
	src: string;
	i: number;
	line: number;
	lineStart: number;
	indent: number;
	delimiters: Delimiter[];
	refs: Record<string, string>;
}
