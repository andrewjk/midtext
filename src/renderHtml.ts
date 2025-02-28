import blockQuoteRule from "./render/blockQuoteRule";
import codeBlockRule from "./render/codeBlockRule";
import codeSpanRule from "./render/codeSpanRule";
import documentRule from "./render/documentRule";
import emphasisRule from "./render/emphasisRule";
import hardBreakRule from "./render/hardBreakRule";
import headingRule from "./render/headingRule";
import headingUnderlineRule from "./render/headingUnderlineRule";
import highlightRule from "./render/highlightRule";
import linkReferenceRule from "./render/linkReferenceRule";
import linkRule from "./render/linkRule";
import listBulletedRule from "./render/listBulletedRule";
import listItemRule from "./render/listItemRule";
import listOrderedRule from "./render/listOrderedRule";
import paragraphRule from "./render/paragraphRule";
import rawBlockRule from "./render/rawBlockRule";
import rawSpanRule from "./render/rawSpanRule";
import renderNode from "./render/renderNode";
import sectionBreakRule from "./render/sectionBreakRule";
import strikethroughRule from "./render/strikethroughRule";
import strongEmphasisRule from "./render/strongEmphasisRule";
import superscriptRule from "./render/superscriptRule";
import tableCellRule from "./render/tableCellRule";
import tableHeaderRule from "./render/tableHeaderRule";
import tableRowRule from "./render/tableRowRule";
import tableRule from "./render/tableRule";
import taskItemRule from "./render/taskItemRule";
import textRule from "./render/textRule";
import type MarkdownNode from "./types/MarkdownNode";
import type RenderRule from "./types/RenderRule";

export default function renderHtml(root: MarkdownNode): string {
	let rules = new Map<string, RenderRule>();

	rules.set(documentRule.name, documentRule);

	rules.set(blockQuoteRule.name, blockQuoteRule);
	rules.set(codeBlockRule.name, codeBlockRule);
	rules.set(headingRule.name, headingRule);
	rules.set(headingUnderlineRule.name, headingUnderlineRule);
	rules.set(linkReferenceRule.name, linkReferenceRule);
	rules.set(listBulletedRule.name, listBulletedRule);
	rules.set(listOrderedRule.name, listOrderedRule);
	rules.set(listItemRule.name, listItemRule);
	rules.set(paragraphRule.name, paragraphRule);
	rules.set(rawBlockRule.name, rawBlockRule);
	rules.set(sectionBreakRule.name, sectionBreakRule);
	rules.set(tableRule.name, tableRule);
	rules.set(tableHeaderRule.name, tableHeaderRule);
	rules.set(tableRowRule.name, tableRowRule);
	rules.set(tableCellRule.name, tableCellRule);
	rules.set(taskItemRule.name, taskItemRule);

	rules.set(codeSpanRule.name, codeSpanRule);
	rules.set(strongEmphasisRule.name, strongEmphasisRule);
	rules.set(emphasisRule.name, emphasisRule);
	rules.set(hardBreakRule.name, hardBreakRule);
	rules.set(highlightRule.name, highlightRule);
	rules.set(linkRule.name, linkRule);
	rules.set(rawSpanRule.name, rawSpanRule);
	rules.set(strikethroughRule.name, strikethroughRule);
	rules.set(superscriptRule.name, superscriptRule);
	rules.set(textRule.name, textRule);

	let state = { output: "", rules };

	renderNode(root, state);

	return state.output;
}
