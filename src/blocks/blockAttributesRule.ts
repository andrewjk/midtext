import parseAttributes from "../parse/parseAttributes";
import type BlockParserState from "../types/BlockParserState";
import type BlockRule from "../types/BlockRule";
import type MidtextNode from "../types/MidtextNode";
import consumeAttributes from "../utils/consumeAttributes";

const name = "block_attributes";

function testStart(state: BlockParserState, parent: MidtextNode) {
	let char = state.src[state.i];
	if (char === "{") {
		// If there's an open paragraph, close it
		if (parent.type === "paragraph") {
			state.openNodes.pop();
		}

		const content = consumeAttributes(state.src, state.i);
		if (content) {
			state.attributes = parseAttributes(content);

			state.i += content.length + 2;
			return true;
		}
	}

	return false;
}

function testContinue(state: BlockParserState, node: MidtextNode) {
	return false;
}

export default {
	name,
	testStart,
	testContinue,
} satisfies BlockRule;
