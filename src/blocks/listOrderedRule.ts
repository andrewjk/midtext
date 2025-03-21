import type BlockParserState from "../types/BlockParserState";
import type BlockRule from "../types/BlockRule";
import type MidtextNode from "../types/MidtextNode";
import { isAlpha, isNumeric } from "../utils/isAlphaNumeric";
import isEscaped from "../utils/isEscaped";
import isNewLine from "../utils/isNewLine";
import isSpace from "../utils/isSpace";
import listRule, { type ListInfo } from "./listRule";

const name = "list_ordered";

function getMarkup(state: BlockParserState): ListInfo | undefined {
	let numbers = "";
	let delimiter = "";
	let end = state.i;
	if (isNumeric(state.src.charCodeAt(end)) && !isEscaped(state.src, state.i)) {
		numbers = state.src[end++];
		while (isNumeric(state.src.charCodeAt(end))) {
			numbers += state.src[end];
			end++;
		}
		delimiter = "1";
	} else if (isAlpha(state.src.charCodeAt(end)) && !isEscaped(state.src, state.i)) {
		numbers = state.src[end++];
		delimiter = numbers === numbers.toLowerCase() ? "a" : "A";
	}
	let orderedList =
		!isEscaped(state.src, state.i) &&
		numbers.length > 0 &&
		numbers.length < 10 &&
		state.src[end] === "." &&
		(end === state.src.length - 1 || isSpace(state.src.charCodeAt(end + 1)));
	if (orderedList) {
		return {
			delimiter,
			markup: numbers + ".",
			isBlank: end === state.src.length - 1 || isNewLine(state.src[end + 1]),
			name,
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
