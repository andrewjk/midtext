import type BlockParserState from "../types/BlockParserState";
import parseBlock from "./parseBlock";
import parseIndent from "./parseIndent";

export default function parseLine(state: BlockParserState) {
	state.indent = 0;
	state.line++;
	state.lineStart = state.i;

	parseIndent(state, 0);

	// Check whether we should continue with the nodes that are open
	// Skip document -- it's always going to continue
	for (let i = 1; i < state.openNodes.length; i++) {
		let node = state.openNodes[i];

		// This might have been e.g. an item that was removed in a list rule
		if (!node) {
			break;
		}

		// TODO: Fallback rule??
		let rule = state.rules.get(node.type)!;
		if (rule) {
			const hadBlankLine = state.blankLevel !== -1 && state.blankLevel < i;
			if (rule.testContinue(state, node, hadBlankLine)) {
				// TODO: Is there a rule that shouldn't do this?
				parseIndent(state, i);
			} else {
				state.openNodes.length = i;
				break;
			}
		}
	}

	parseBlock(state, state.openNodes.length - 1);
}
