import { blockRules } from "../parse";
import type BlockParserState from "../types/BlockParserState";
import type MarkdownNode from "../types/MarkdownNode";
import parseIndent from "./parseIndent";

export default function parseBlock(state: BlockParserState, parent: MarkdownNode) {
	parseIndent(state, state.openNodes.indexOf(parent));

	for (let rule of blockRules.values()) {
		if (!parent.acceptsContent || !!rule.acceptsContent) {
			let handled = rule.testStart(state, parent);

			if (handled) {
				if (state.atLineEnd) {
					state.atLineEnd = false;
				}

				// TODO: Should we make sure we are AFTER the line end?

				return;
			}
		}
	}
}
