import type Delimiter from "../types/Delimiter";
import type InlineParserState from "../types/InlineParserState";
import type InlineRule from "../types/InlineRule";
import escapeBackslashes from "../utils/escapeBackslashes";
import isEscaped from "../utils/isEscaped";

const name = "auto_link";

function test(state: InlineParserState) {
	let char = state.src[state.i];

	if (char === "<" && !isEscaped(state.src, state.i)) {
		return testLinkOpen(state);
	}

	if (char === ">" && !isEscaped(state.src, state.i)) {
		return testLinkClose(state);
	}

	return false;
}

export default {
	name,
	test,
} satisfies InlineRule;

function testLinkOpen(state: InlineParserState) {
	state.delimiters.push({
		name: "link",
		markup: "<",
		length: 1,
		start: state.i,
		end: -1,
		canOpen: true,
		canClose: false,
	});
	state.i++;
	return true;
}

function testLinkClose(state: InlineParserState) {
	let startDelimiter: Delimiter | undefined;
	let i = state.delimiters.length;
	while (i--) {
		let prevDelimiter = state.delimiters[i];
		if (!prevDelimiter.handled) {
			if (prevDelimiter.markup === "<") {
				startDelimiter = prevDelimiter;
				break;
			} else {
				continue;
			}
		}
	}

	if (startDelimiter) {
		let content = state.src.substring(startDelimiter.start + startDelimiter.markup.length, state.i);
		// HACK: Probably should be stricter...
		if (content.includes(":")) {
			let link = encodeURI(decodeURI(escapeBackslashes(content)));

			state.delimiters.push({
				name,
				markup: startDelimiter.markup,
				length: 1,
				start: state.i,
				end: -1,
				canOpen: false,
				canClose: true,
				info: link,
			});

			state.i++;
			return true;
		}
	}

	return false;
}
