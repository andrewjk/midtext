import { blockRules } from "./parse";
import parseIndent from "./parseIndent";
import type BlockParserState from "./types/BlockParserState";
import type MarkdownNode from "./types/MarkdownNode";

export default function parseBlock(state: BlockParserState, parent: MarkdownNode) {
	parseIndent(state, state.openNodes.indexOf(parent));

	for (let rule of blockRules.values()) {
		let start = state.i;
		if (!parent.acceptsContent || !!rule.acceptsContent) {
			let handled = rule.testStart(state, parent);

			if (handled) {
				if (state.debug) {
					console.log(`Found ${rule.name}, at ${start}`);
				}

				if (state.atLineEnd) {
					state.atLineEnd = false;
				}

				// DEBUG: Make sure we are AFTER the line end?

				return;
			}
		}
	}
}
