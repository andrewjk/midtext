import type Attribute from "./Attribute";
import type BlockRule from "./BlockRule";
import type MarkdownNode from "./MarkdownNode";

export default interface BlockParserState {
	src: string;
	rules: Map<string, BlockRule>;
	i: number;
	line: number;
	lineStart: number;
	indent: number;
	openNodes: MarkdownNode[];
	atLineEnd: boolean;
	blankLevel: number;
	refs: Record<string, string>;
	attributes?: Attribute[];
}
