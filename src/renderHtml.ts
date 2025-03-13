import blockQuoteRenderer from "./render/blockQuoteRenderer";
import codeBlockRenderer from "./render/codeBlockRenderer";
import codeSpanRenderer from "./render/codeSpanRenderer";
import documentRenderer from "./render/documentRenderer";
import emphasisRenderer from "./render/emphasisRenderer";
import hardBreakRenderer from "./render/hardBreakRenderer";
import headingRenderer from "./render/headingRenderer";
import headingUnderlineRenderer from "./render/headingUnderlineRenderer";
import highlightRenderer from "./render/highlightRenderer";
import linkReferenceRenderer from "./render/linkReferenceRenderer";
import linkRenderer from "./render/linkRenderer";
import listBulletedRenderer from "./render/listBulletedRenderer";
import listItemRenderer from "./render/listItemRenderer";
import listOrderedRenderer from "./render/listOrderedRenderer";
import paragraphRenderer from "./render/paragraphRenderer";
import rawBlockRenderer from "./render/rawBlockRenderer";
import rawSpanRenderer from "./render/rawSpanRenderer";
import renderNode from "./render/renderNode";
import sectionBreakRenderer from "./render/sectionBreakRenderer";
import strikethroughRenderer from "./render/strikethroughRenderer";
import strongEmphasisRenderer from "./render/strongEmphasisRenderer";
import superscriptRenderer from "./render/superscriptRenderer";
import tableCellRenderer from "./render/tableCellRenderer";
import tableHeaderRenderer from "./render/tableHeaderRenderer";
import tableRenderer from "./render/tableRenderer";
import tableRowRenderer from "./render/tableRowRenderer";
import taskItemRenderer from "./render/taskItemRenderer";
import textRenderer from "./render/textRenderer";
import type MarkdownNode from "./types/MarkdownNode";
import type RenderRule from "./types/RenderRule";

export default function renderHtml(root: MarkdownNode): string {
	let rules = new Map<string, RenderRule>();

	rules.set(documentRenderer.name, documentRenderer);

	rules.set(blockQuoteRenderer.name, blockQuoteRenderer);
	rules.set(codeBlockRenderer.name, codeBlockRenderer);
	rules.set(headingRenderer.name, headingRenderer);
	rules.set(headingUnderlineRenderer.name, headingUnderlineRenderer);
	rules.set(linkReferenceRenderer.name, linkReferenceRenderer);
	rules.set(listBulletedRenderer.name, listBulletedRenderer);
	rules.set(listOrderedRenderer.name, listOrderedRenderer);
	rules.set(listItemRenderer.name, listItemRenderer);
	rules.set(paragraphRenderer.name, paragraphRenderer);
	rules.set(rawBlockRenderer.name, rawBlockRenderer);
	rules.set(sectionBreakRenderer.name, sectionBreakRenderer);
	rules.set(tableRenderer.name, tableRenderer);
	rules.set(tableHeaderRenderer.name, tableHeaderRenderer);
	rules.set(tableRowRenderer.name, tableRowRenderer);
	rules.set(tableCellRenderer.name, tableCellRenderer);
	rules.set(taskItemRenderer.name, taskItemRenderer);

	rules.set(codeSpanRenderer.name, codeSpanRenderer);
	rules.set(strongEmphasisRenderer.name, strongEmphasisRenderer);
	rules.set(emphasisRenderer.name, emphasisRenderer);
	rules.set(hardBreakRenderer.name, hardBreakRenderer);
	rules.set(highlightRenderer.name, highlightRenderer);
	rules.set(linkRenderer.name, linkRenderer);
	rules.set(rawSpanRenderer.name, rawSpanRenderer);
	rules.set(strikethroughRenderer.name, strikethroughRenderer);
	rules.set(superscriptRenderer.name, superscriptRenderer);
	rules.set(textRenderer.name, textRenderer);

	let state = { output: "", rules };

	renderNode(root, state);

	return state.output;
}
