import type BlockParserState from "../types/BlockParserState";
import type MarkdownNode from "../types/MarkdownNode";
import parseIndent from "./parseIndent";

export default function parseBlock(state: BlockParserState, parent: MarkdownNode) {
	parseIndent(state, state.openNodes.indexOf(parent));

	for (let rule of state.rules.values()) {
		if (!parent.acceptsContent || !!rule.acceptsContent) {
			let handled = rule.testStart(state, parent);

			if (handled) {
				state.atLineEnd = false;

				// TODO: Should we make sure we are AFTER the line end?

				return;
			}
		}
	}
}
