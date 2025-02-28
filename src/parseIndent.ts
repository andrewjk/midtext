import type BlockParserState from "./types/BlockParserState";
import isNewLine from "./utils/isNewLine";
import isSpace from "./utils/isSpace";

export default function parseIndent(state: BlockParserState) {
	let start = state.i - state.lineStart;
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
				let lastNode = state.openNodes.at(-1)!;
				//if (lastNode.children?.length) {
				//	lastNode = lastNode.children.at(-1)!;
				//}
				if (start <= lastNode.column) {
					//lastNode.loose = true;
				}
				state.hasBlankLine = true;
				break;
			} else {
				break;
			}
		}
	}
}
