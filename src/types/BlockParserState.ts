import type Attribute from "./Attribute";
import type BlockRule from "./BlockRule";
import type MidtextNode from "./MidtextNode";

export default interface BlockParserState {
	src: string;
	rules: Map<string, BlockRule>;
	i: number;
	line: number;
	lineStart: number;
	indent: number;
	openNodes: MidtextNode[];
	atLineEnd: boolean;
	blankLevel: number;
	refs: Record<string, string>;
	attributes?: Attribute[];
}
