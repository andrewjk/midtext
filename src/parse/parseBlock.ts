import type BlockParserState from "../types/BlockParserState";
import parseIndent from "./parseIndent";

/**
 * Parses the start of a block element by looping through block rules until one
 * is matched.
 *
 * @param state The BlockParserState.
 * @param index The index of the currently open node in the state's `openNodes` stack.
 * array.
 */
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
