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
	let startDelimiterIndex = -1;
	let i = state.delimiters.length;
	while (i--) {
		let prevDelimiter = state.delimiters[i];
		if (prevDelimiter.handled) {
			// At this stage, the only delimiters that are handled are ones that
			// have the same or higher precedence, so we cannot surround them
			//break;
		} else {
			if (prevDelimiter.canOpen && prevDelimiter.markup === "<") {
				startDelimiter = prevDelimiter;
				startDelimiterIndex = i;
				break;
			} else {
				continue;
			}
		}
	}

	if (startDelimiter) {
		let content = state.src.substring(startDelimiter.start + startDelimiter.markup.length, state.i);

		if (/\s/.test(content)) {
			return false;
		}

		// TODO: Should be stricter in defining what is and isn't an autolink
		let isEmail = /.@./.test(content);
		let isLink = /.[\.:]./.test(content);

		if (isEmail || isLink) {
			// Remove all the opening delimiters so they won't be picked up in future
			let d = state.delimiters.length;
			while (d--) {
				let prevDelimiter = state.delimiters[d];
				// HACK: We shouldn't be referring to links or images!
				if (
					//prevDelimiter.markup === "![" ||
					prevDelimiter.markup === "[" ||
					prevDelimiter.markup === "]" ||
					prevDelimiter.markup === "<"
				) {
					prevDelimiter.handled = true;
				} else if (d > startDelimiterIndex) {
					prevDelimiter.handled = true;
				}
			}

			let link = encodeURI(decodeURI(escapeBackslashes(content)));

			if (isEmail && !link.startsWith("mailto:") && !link.startsWith("MAILTO:")) {
				link = `mailto:${link}`;
			}

			state.delimiters.push({
				name,
				markup: startDelimiter.markup,
				length: 1,
				start: state.i,
				end: -1,
				canOpen: false,
				canClose: true,
				handled: true,
				//info: link,
			});

			startDelimiter.handled = true;
			startDelimiter.end = state.i;
			startDelimiter.info = link;

			state.i++;
			return true;
		}
	}

	return false;
}
