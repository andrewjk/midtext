import type InlineParserState from "../types/InlineParserState";
import type InlineRule from "../types/InlineRule";
import delimiterLength from "../utils/delimiterLength";
import isEscaped from "../utils/isEscaped";

function test(state: InlineParserState) {
	let char = state.src[state.i];
	if (char === "`" && !isEscaped(state.src, state.i)) {
		let start = state.i;

		let length = delimiterLength(state.src, char, start);

		if (length < 3) {
			// "The contents of a code block are literal text, and do not get parsed as Markdown"
			let closeEnd = state.i + length;
			let closeLength = 0;
			for (; closeEnd < state.src.length; closeEnd++) {
				if (state.src[closeEnd] === char) {
					closeLength = delimiterLength(state.src, char, closeEnd);
					if (closeLength === length) {
						break;
					} else {
						closeEnd += closeLength;
					}
				}
			}
			if (closeLength === length) {
				let content = state.src.substring(state.i + length, closeEnd);

				// NOTE: We strip newlines and replace internal newlines
				// with spaces, so that you can have your arbitrarily
				// broken text converted into automatically wrapped
				// HTML, even with preserve-whitespace set in CSS
				content = content
					.replaceAll(/^[\r\n]+/g, "")
					.replaceAll(/[\r\n]+$/g, "")
					.replaceAll(/[\r\n]/g, " ");

				state.delimiters.push({
					name: "code_span",
					markup: char,
					line: state.line,
					start,
					end: closeEnd,
					length,
					canOpen: false,
					canClose: false,
					content,
					acceptsContent: true,
				});

				state.i = closeEnd + closeLength;
				return true;
			}
		}

		state.i += length;
		return true;
	}

	return false;
}

export default {
	name: "code_span",
	test,
} satisfies InlineRule;
