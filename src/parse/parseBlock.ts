import type BlockParserState from "../types/BlockParserState";
import parseIndent from "./parseIndent";

export default function parseBlock(state: BlockParserState, index: number) {
	parseIndent(state, index);

	for (let rule of state.rules.values()) {
		if (!state.openNodes[index].acceptsContent || !!rule.acceptsContent) {
			let handled = rule.testStart(state);

			if (handled) {
				state.atLineEnd = false;

				// TODO: Should we make sure we are AFTER the line end?

				return;
			}
		}
	}
}
