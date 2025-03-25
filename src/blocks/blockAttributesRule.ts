import parseAttributes from "../parse/parseAttributes";
import type BlockParserState from "../types/BlockParserState";
import type BlockRule from "../types/BlockRule";
import consumeAttributes from "../utils/consumeAttributes";
import evictBlocks from "../utils/evictBlocks";
import isEscaped from "../utils/isEscaped";

function testStart(state: BlockParserState) {
	let char = state.src[state.i];
	if (char === "{" && !isEscaped(state.src, state.i)) {
		// Close blocks that this node shouldn't be nested under
		evictBlocks(state);

		const content = consumeAttributes(state.src, state.i);
		if (content) {
			state.attributes = parseAttributes(content);

			state.i += content.length + 2;
			return true;
		}
	}

	return false;
}

export default {
	name: "block_attributes",
	testStart,
	testContinue: () => false,
} satisfies BlockRule;
