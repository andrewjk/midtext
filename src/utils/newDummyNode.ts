import type MidtextNode from "../types/MidtextNode";

export default function newDummyNode(name: string, block: boolean): MidtextNode {
	return {
		name,
		block,
		offset: -1,
		line: -1,
		column: -1,
		markup: "",
		delimiter: "",
		content: "",
		indent: -1,
		subindent: -1,
	};
}
