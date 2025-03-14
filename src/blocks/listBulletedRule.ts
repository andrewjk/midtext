import type BlockParserState from "../types/BlockParserState";
import type BlockRule from "../types/BlockRule";
import type MidtextNode from "../types/MidtextNode";
import isEscaped from "../utils/isEscaped";
import isNewLine from "../utils/isNewLine";
import isSpace from "../utils/isSpace";
import listRule, { type ListInfo } from "./listRule";

const name = "list_bulleted";

function getMarkup(state: BlockParserState): ListInfo | undefined {
	let char = state.src[state.i];
	if (
		(char === "-" || char === "*" || char === "+") &&
		!isEscaped(state.src, state.i) &&
		// TODO: Should this be part of the isSpace/isNewLine check? i.e. eof counts as a space?
		(state.i === state.src.length - 1 || isSpace(state.src.charCodeAt(state.i + 1)))
	) {
		return {
			delimiter: char,
			markup: char,
			isBlank: state.i === state.src.length - 1 || isNewLine(state.src[state.i + 1]),
			type: name,
		};
	}
}

function testStart(state: BlockParserState) {
	let info = getMarkup(state);
	return listRule.testStart(state, info);
}

function testContinue(state: BlockParserState, node: MidtextNode, hadBlankLine: boolean) {
	let info = getMarkup(state);
	return listRule.testContinue(state, node, hadBlankLine, info);
}

export default {
	name,
	testStart,
	testContinue,
} satisfies BlockRule;
