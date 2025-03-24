import type InlineParserState from "../types/InlineParserState";
import type InlineRule from "../types/InlineRule";
import escapeBackslashes from "../utils/escapeBackslashes";
import isEscaped from "../utils/isEscaped";

const name = "auto_link";

function test(state: InlineParserState) {
	let char = state.src[state.i];
	if (char === "<" && !isEscaped(state.src, state.i)) {
		let start = state.i;

		let closeEnd = -1;
		for (let j = state.i + 1; j < state.src.length; j++) {
			if (state.src[j] === ">" && !isEscaped(state.src, j)) {
				closeEnd = j;
				break;
			}
		}
		if (closeEnd !== -1) {
			let content = state.src.substring(state.i + 1, closeEnd);

			// TODO: Should we allow spaces around newlines, so that the user
			// can split an autolink over multiple lines?
			if (/\s/.test(content)) {
				return false;
			}

			// TODO: Should be stricter in defining what is and isn't an autolink
			let isEmail = /.@./.test(content);
			let isLink = /.[\.:]./.test(content);

			if (isEmail || isLink) {
				let link = encodeURI(decodeURI(escapeBackslashes(content)));

				if (isEmail && !link.startsWith("mailto:") && !link.startsWith("MAILTO:")) {
					link = `mailto:${link}`;
				}

				state.delimiters.push({
					name: "link",
					markup: char,
					line: state.line,
					start,
					end: closeEnd,
					length: 1,
					canOpen: false,
					canClose: false,
					content,
					info: link,
				});

				state.i = closeEnd + 1;
				return true;
			}
		}

		state.i += 1;
		return true;
	}

	return false;
}

export default {
	name,
	test,
} satisfies InlineRule;
