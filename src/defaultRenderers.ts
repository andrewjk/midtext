import blockQuoteRenderer from "./render/blockQuoteRenderer";
import codeBlockRenderer from "./render/codeBlockRenderer";
import codeSpanRenderer from "./render/codeSpanRenderer";
import documentRenderer from "./render/documentRenderer";
import emphasisRenderer from "./render/emphasisRenderer";
import footnoteReferenceRenderer from "./render/footnoteReferenceRenderer";
import footnoteRenderer from "./render/footnoteRenderer";
import hardBreakRenderer from "./render/hardBreakRenderer";
import headingRenderer from "./render/headingRenderer";
import headingUnderlineRenderer from "./render/headingUnderlineRenderer";
import highlightRenderer from "./render/highlightRenderer";
import imageRenderer from "./render/imageRenderer";
import linkReferenceRenderer from "./render/linkReferenceRenderer";
import linkRenderer from "./render/linkRenderer";
import listBulletedRenderer from "./render/listBulletedRenderer";
import listItemRenderer from "./render/listItemRenderer";
import listOrderedRenderer from "./render/listOrderedRenderer";
import paragraphRenderer from "./render/paragraphRenderer";
import rawBlockRenderer from "./render/rawBlockRenderer";
import rawSpanRenderer from "./render/rawSpanRenderer";
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
import type Renderer from "./types/Renderer";

let defaultRenderers = new Map<string, Renderer>();

// Block
defaultRenderers.set(documentRenderer.name, documentRenderer);
defaultRenderers.set(blockQuoteRenderer.name, blockQuoteRenderer);
defaultRenderers.set(codeBlockRenderer.name, codeBlockRenderer);
defaultRenderers.set(footnoteReferenceRenderer.name, footnoteReferenceRenderer);
defaultRenderers.set(headingRenderer.name, headingRenderer);
defaultRenderers.set(headingUnderlineRenderer.name, headingUnderlineRenderer);
defaultRenderers.set(linkReferenceRenderer.name, linkReferenceRenderer);
defaultRenderers.set(listBulletedRenderer.name, listBulletedRenderer);
defaultRenderers.set(listOrderedRenderer.name, listOrderedRenderer);
defaultRenderers.set(listItemRenderer.name, listItemRenderer);
defaultRenderers.set(paragraphRenderer.name, paragraphRenderer);
defaultRenderers.set(rawBlockRenderer.name, rawBlockRenderer);
defaultRenderers.set(sectionBreakRenderer.name, sectionBreakRenderer);
defaultRenderers.set(tableRenderer.name, tableRenderer);
defaultRenderers.set(tableHeaderRenderer.name, tableHeaderRenderer);
defaultRenderers.set(tableRowRenderer.name, tableRowRenderer);
defaultRenderers.set(tableCellRenderer.name, tableCellRenderer);
defaultRenderers.set(taskItemRenderer.name, taskItemRenderer);

// Inline
defaultRenderers.set(codeSpanRenderer.name, codeSpanRenderer);
defaultRenderers.set(strongEmphasisRenderer.name, strongEmphasisRenderer);
defaultRenderers.set(emphasisRenderer.name, emphasisRenderer);
defaultRenderers.set(footnoteRenderer.name, footnoteRenderer);
defaultRenderers.set(hardBreakRenderer.name, hardBreakRenderer);
defaultRenderers.set(highlightRenderer.name, highlightRenderer);
defaultRenderers.set(linkRenderer.name, linkRenderer);
defaultRenderers.set(imageRenderer.name, imageRenderer);
defaultRenderers.set(rawSpanRenderer.name, rawSpanRenderer);
defaultRenderers.set(strikethroughRenderer.name, strikethroughRenderer);
defaultRenderers.set(superscriptRenderer.name, superscriptRenderer);
defaultRenderers.set(textRenderer.name, textRenderer);

export default defaultRenderers;
