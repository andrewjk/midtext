import { blockRules } from "./parse";
import parseBlock from "./parseBlock";
import parseIndent from "./parseIndent";
import type BlockParserState from "./types/BlockParserState";

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
		let rule = blockRules.get(node.type)!;
		if (rule) {
			if (rule.testContinue(state, node)) {
				// TODO: Is there a rule that shouldn't do this?
				parseIndent(state, i);
			} else {
				state.openNodes.length = i;
				break;
			}
		}
	}

	let parent = state.openNodes.at(-1)!;
	parseBlock(state, parent);
}
