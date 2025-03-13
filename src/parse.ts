import asideRule from "./blocks/asideRule";
import blockAttributesRule from "./blocks/blockAttributesRule";
import blockQuoteRule from "./blocks/blockQuoteRule";
import codeBlockRule from "./blocks/codeBlockRule";
import displayRule from "./blocks/detailsRule";
import divRule from "./blocks/divRule";
import headingRule from "./blocks/headingRule";
import headingUnderlineRule from "./blocks/headingUnderlineRule";
import linkReferenceRule from "./blocks/linkReferenceRule";
import listBulletedRule from "./blocks/listBulletedRule";
import listOrderedRule from "./blocks/listOrderedRule";
import paragraphRule from "./blocks/paragraphRule";
import rawBlockRule from "./blocks/rawBlockRule";
import sectionBreakRule from "./blocks/sectionBreakRule";
import tableRule from "./blocks/tableRule";
import taskItemRule from "./blocks/taskItemRule";
import codeSpanRule from "./inlines/codeSpanRule";
import emphasisRule from "./inlines/emphasisRule";
import hardBreakRule from "./inlines/hardBreakRule";
import highlightRule from "./inlines/highlightRule";
import linkRule from "./inlines/linkRule";
import rawSpanRule from "./inlines/rawSpanRule";
import spanAttributesRule from "./inlines/spanAttributesRule";
import spanRule from "./inlines/spanRule";
import strikethroughRule from "./inlines/strikethroughRule";
import superscriptRule from "./inlines/superscriptRule";
import textRule from "./inlines/textRule";
import parseBlockInlines from "./parseBlockInlines";
import parseLine from "./parseLine";
import type BlockParserState from "./types/BlockParserState";
import type BlockRule from "./types/BlockRule";
import type InlineRule from "./types/InlineRule";
import type MarkdownNode from "./types/MarkdownNode";
import newBlockNode from "./utils/newBlockNode";

// TODO: Do paragraph (block) and text (inline) rules need to be set if these are empty?
export let blockRules = new Map<string, BlockRule>();
export let inlineRules = new Map<string, InlineRule>();

export default function parse(src: string, debug: boolean): MarkdownNode {
	blockRules.set(blockAttributesRule.name, blockAttributesRule);
	blockRules.set(headingRule.name, headingRule);
	blockRules.set(headingUnderlineRule.name, headingUnderlineRule);
	blockRules.set(sectionBreakRule.name, sectionBreakRule);
	blockRules.set(listBulletedRule.name, listBulletedRule);
	blockRules.set(listOrderedRule.name, listOrderedRule);
	blockRules.set(taskItemRule.name, taskItemRule);
	blockRules.set(blockQuoteRule.name, blockQuoteRule);
	blockRules.set(displayRule.name, displayRule);
	blockRules.set(asideRule.name, asideRule);
	blockRules.set(codeBlockRule.name, codeBlockRule);
	blockRules.set(rawBlockRule.name, rawBlockRule);
	blockRules.set(tableRule.name, tableRule);
	blockRules.set(divRule.name, divRule);
	blockRules.set(linkReferenceRule.name, linkReferenceRule);
	blockRules.set(paragraphRule.name, paragraphRule);

	inlineRules.set(spanAttributesRule.name, spanAttributesRule);
	inlineRules.set(rawSpanRule.name, rawSpanRule);
	inlineRules.set(codeSpanRule.name, codeSpanRule);
	inlineRules.set(emphasisRule.name, emphasisRule);
	inlineRules.set(strikethroughRule.name, strikethroughRule);
	inlineRules.set(highlightRule.name, highlightRule);
	inlineRules.set(superscriptRule.name, superscriptRule);
	inlineRules.set(linkRule.name, linkRule);
	inlineRules.set(spanRule.name, spanRule);
	inlineRules.set(hardBreakRule.name, hardBreakRule);
	inlineRules.set(textRule.name, textRule);

	let state: BlockParserState = {
		src,
		i: 0,
		line: 0,
		lineStart: 0,
		indent: 0,
		atLineEnd: false,
		hadBlankLine: false,
		openNodes: [],
		refs: {},
		debug,
		blankLevel: -1,
	};

	let document = newBlockNode("document", 0, 1, 0, "", 0);
	state.openNodes.push(document);

	if (!state.src.endsWith("\n")) {
		state.src += "\n";
	}

	// Stage 1 -- parse the line into blocks
	while (state.i < state.src.length) {
		parseLine(state);
	}

	// Stage 2 -- parse the inlines for each block
	parseBlockInlines(state, document, state.refs);

	return document;
}
