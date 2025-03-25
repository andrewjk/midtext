import type BlockParserState from "../types/BlockParserState";
import type BlockRule from "../types/BlockRule";
import type MidtextNode from "../types/MidtextNode";
import isEscaped from "../utils/isEscaped";
import isNewLine from "../utils/isNewLine";
import isSpace from "../utils/isSpace";
import { type ListInfo, listTestContinue, listTestStart } from "./listRule";

function getMarkup(state: BlockParserState): ListInfo | undefined {
	let char = state.src[state.i];
	if (
		(char === "-" || char === "*" || char === "+") &&
		!isEscaped(state.src, state.i) &&
		isSpace(state.src.charCodeAt(state.i + 1))
	) {
		return {
			delimiter: char,
			markup: char,
			isBlank: state.i === state.src.length - 1 || isNewLine(state.src[state.i + 1]),
			name: "list_bulleted",
		};
	}
}

export default {
	name: "list_bulleted",
	testStart: (state: BlockParserState) => listTestStart(state, getMarkup(state)),
	testContinue: (state: BlockParserState, node: MidtextNode, hadBlankLine: boolean) =>
		listTestContinue(state, node, hadBlankLine, getMarkup(state)),
} satisfies BlockRule;
