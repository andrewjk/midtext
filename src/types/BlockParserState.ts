import type Attribute from "./Attribute";
import type MarkdownNode from "./MarkdownNode";

export default interface BlockParserState {
	src: string;
	i: number;
	line: number;
	lineStart: number;
	indent: number;
	openNodes: MarkdownNode[];
	maybeContinue: boolean;
	hasBlankLine: boolean;
	hadBlankLine: boolean;
	refs: Record<string, string>;
	attributes?: Attribute[];

	// HACK:
	debug?: boolean;
}
