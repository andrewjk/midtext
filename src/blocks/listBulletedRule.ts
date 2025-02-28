import type BlockParserState from "../types/BlockParserState";
import type BlockRule from "../types/BlockRule";
import type MarkdownNode from "../types/MarkdownNode";
import isNewLine from "../utils/isNewLine";
import isSpace from "../utils/isSpace";
import listRule, { type ListInfo } from "./listRule";

const name = "list_bulleted";

function getMarkup(state: BlockParserState): ListInfo | undefined {
	let char = state.src[state.i];
	if (
		(char === "-" || char === "*" || char === "+") &&
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

function testStart(state: BlockParserState, parent: MarkdownNode) {
	let info = getMarkup(state);
	return listRule.testStart(state, parent, info);
}

function testContinue(state: BlockParserState, node: MarkdownNode) {
	let info = getMarkup(state);
	return listRule.testContinue(state, node, info);
}

export default {
	name,
	testStart,
	testContinue,
} satisfies BlockRule;
