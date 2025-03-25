import type BlockParserState from "../types/BlockParserState";

/**
 * Parses indentation, by adding spaces and setting tabs to the next tabstop of
 * 4 characters.
 *
 * @param state The BlockParserState
 * @param index The index of the currently open node in the state's `openNodes`
 * stack.
 */
export default function parseIndent(state: BlockParserState, index: number) {
	loop: for (; state.i < state.src.length; state.i++) {
		switch (state.src.charCodeAt(state.i)) {
			// space, nbsp
			case 0x20:
			case 0xa0: {
				state.indent += 1;
				break;
			}
			// tab
			case 0x09: {
				// Set spaces to the next tabstop of 4 characters (e.g. for
				// '  \t', set the spaces to 4)
				state.indent += 4 - (state.indent % 4);
				break;
			}
			// cr, lf
			case 0x0d:
			case 0x0a: {
				state.atLineEnd = true;
				if (state.blankLevel === -1) {
					state.blankLevel = index;
				}
				break loop;
			}
			default: {
				break loop;
			}
		}
	}
}
