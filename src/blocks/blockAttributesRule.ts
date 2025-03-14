import parseAttributes from "../parse/parseAttributes";
import type BlockParserState from "../types/BlockParserState";
import type BlockRule from "../types/BlockRule";
import type MidtextNode from "../types/MidtextNode";
import consumeAttributes from "../utils/consumeAttributes";
import isEscaped from "../utils/isEscaped";

const name = "block_attributes";

function testStart(state: BlockParserState) {
	let char = state.src[state.i];
	if (char === "{" && !isEscaped(state.src, state.i)) {
		let parent = state.openNodes.at(-1)!;

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

function testContinue(state: BlockParserState, node: MidtextNode, hadBlankLine: boolean) {
	return false;
}

export default {
	name,
	testStart,
	testContinue,
} satisfies BlockRule;
