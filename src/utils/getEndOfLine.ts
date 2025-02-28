import type BlockParserState from "../types/BlockParserState";
import isNewLine from "./isNewLine";

// TODO: This should be consumeUntil

export default function getEndOfLine(state: BlockParserState) {
	let endOfLine = state.i;
	for (; endOfLine < state.src.length; endOfLine++) {
		if (isNewLine(state.src[endOfLine])) {
			endOfLine++;
			//state.lineStart = endOfLine;
			break;
		}
	}
	return endOfLine;
}
