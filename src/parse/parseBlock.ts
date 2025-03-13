import type BlockParserState from "../types/BlockParserState";
import type MidtextNode from "../types/MidtextNode";
import parseIndent from "./parseIndent";

export default function parseBlock(state: BlockParserState, parent: MidtextNode) {
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
