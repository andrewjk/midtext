import type BlockParserState from "../types/BlockParserState";
import type BlockRule from "../types/BlockRule";
import type MidtextNode from "../types/MidtextNode";
import getEndOfLine from "../utils/getEndOfLine";
import isEscaped from "../utils/isEscaped";

const name = "comment";

function testStart(state: BlockParserState) {
	let char = state.src[state.i];
	if (char === "/" && state.src[state.i + 1] === "/" && !isEscaped(state.src, state.i)) {
		state.i += 2;
		let endOfLine = getEndOfLine(state);
		state.i = endOfLine;
		return true;
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
