import defaultBlockRules from "./defaultBlockRules";
import defaultInlineRules from "./defaultInlineRules";
import parseBlockInlines from "./parse/parseBlockInlines";
import parseLine from "./parse/parseLine";
import type BlockParserState from "./types/BlockParserState";
import type BlockRule from "./types/BlockRule";
import type InlineRule from "./types/InlineRule";
import type MidtextNode from "./types/MidtextNode";
import newBlockNode from "./utils/newBlockNode";

export default function parse(
	src: string,
	blockRules?: Map<string, BlockRule>,
	inlineRules?: Map<string, InlineRule>,
): MidtextNode {
	blockRules ??= defaultBlockRules;
	inlineRules ??= defaultInlineRules;

	let state: BlockParserState = {
		src,
		rules: blockRules,
		i: 0,
		offset: 0,
		line: -1,
		column: 0,
		lineStart: 0,
		indent: 0,
		atLineEnd: false,
		blankLevel: -1,
		openNodes: [],
		refs: {},
		meta: {},
	};

	let document = newBlockNode("document", state, "", 0, 0);
	state.openNodes.push(document);

	if (!state.src.endsWith("\n")) {
		state.src += "\n";
	}

	// Stage 1 -- parse each line into blocks
	while (state.i < state.src.length) {
		parseLine(state);
	}

	// Stage 2 -- parse the inlines for each block
	parseBlockInlines(state, document, inlineRules);

	return document;
}
