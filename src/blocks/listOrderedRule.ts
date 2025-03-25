import type BlockParserState from "../types/BlockParserState";
import type BlockRule from "../types/BlockRule";
import type MidtextNode from "../types/MidtextNode";
import { isAlpha, isNumeric } from "../utils/isAlphaNumeric";
import isEscaped from "../utils/isEscaped";
import isNewLine from "../utils/isNewLine";
import isSpace from "../utils/isSpace";
import { type ListInfo, listTestContinue, listTestStart } from "./listRule";

function getMarkup(state: BlockParserState): ListInfo | undefined {
	let numbers = "";
	let delimiter = "";
	let end = state.i;
	if (isNumeric(state.src.charCodeAt(end)) && !isEscaped(state.src, state.i)) {
		while (isNumeric(state.src.charCodeAt(end))) {
			end++;
		}
		numbers = state.src.substring(state.i, end);
		delimiter = "1";
	} else if (isAlpha(state.src.charCodeAt(end)) && !isEscaped(state.src, state.i)) {
		numbers = state.src[end++];
		delimiter = numbers === numbers.toLowerCase() ? "a" : "A";
	}
	let orderedList =
		numbers.length > 0 &&
		numbers.length < 10 &&
		state.src[end] === "." &&
		isSpace(state.src.charCodeAt(end + 1));
	if (orderedList) {
		return {
			delimiter,
			markup: numbers + ".",
			isBlank: end === state.src.length - 1 || isNewLine(state.src[end + 1]),
			name: "list_ordered",
		};
	}
}

export default {
	name: "list_ordered",
	testStart: (state: BlockParserState) => listTestStart(state, getMarkup(state)),
	testContinue: (state: BlockParserState, node: MidtextNode, hadBlankLine: boolean) =>
		listTestContinue(state, node, hadBlankLine, getMarkup(state)),
} satisfies BlockRule;
