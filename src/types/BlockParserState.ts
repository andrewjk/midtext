import type Attribute from "./Attribute";
import type BlockRule from "./BlockRule";
import type MidtextNode from "./MidtextNode";

export default interface BlockParserState {
	src: string;
	rules: Map<string, BlockRule>;
	i: number;
	offset: number;
	line: number;
	column: number;
	lineStart: number;
	indent: number;
	openNodes: MidtextNode[];
	atLineEnd: boolean;
	blankLevel: number;
	/** Reference values for links, images, etc */
	refs: Record<string, string>;
	/** Unstructured data that can be set and accessed by rules */
	meta: Record<string, any>;
	/** Attribute values that have been read and should be applied to the next block element */
	attributes?: Attribute[];
}
