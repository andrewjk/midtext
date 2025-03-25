import type BlockParserState from "../types/BlockParserState";
import isNewLine from "../utils/isNewLine";
import isSpace from "../utils/isSpace";

/**
 * Parses indentation, by adding spaces and setting tabs to the next tabstop of
 * 4 characters.
 *
 * @param state The BlockParserState
 * @param index The index of the currently open node in the state's `openNodes`
 * stack.
 */
export default function parseIndent(state: BlockParserState, index: number) {
	if (isSpace(state.src.charCodeAt(state.i))) {
		for (; state.i < state.src.length; state.i++) {
			let char = state.src[state.i];
			if (char === " ") {
				// TODO: All the other spaces
				state.indent += 1;
			} else if (char === "\t") {
				// Set spaces to the next tabstop of 4 characters (e.g. for '  \t', set
				// the spaces to 4)
				state.indent += 4 - (state.indent % 4);
			} else if (isNewLine(char)) {
				state.atLineEnd = true;
				if (state.blankLevel === -1) {
					state.blankLevel = index;
				}
				break;
			} else {
				break;
			}
		}
	}
}
