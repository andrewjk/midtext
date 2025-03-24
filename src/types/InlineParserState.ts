import type Delimiter from "./Delimiter";
import type InlineRule from "./InlineRule";
import type MidtextNode from "./MidtextNode";

export default interface InlineParserState {
	root: MidtextNode;
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
	/** Reference values for links, images, etc */
	refs: Record<string, string>;
	/** Unstructured data that can be set and accessed by rules */
	meta: Record<string, any>;
}
