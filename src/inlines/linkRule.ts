import type Delimiter from "../types/Delimiter";
import type InlineParserState from "../types/InlineParserState";
import type InlineRule from "../types/InlineRule";
import type MidtextNode from "../types/MidtextNode";
import escapeBackslashes from "../utils/escapeBackslashes";
import isEscaped from "../utils/isEscaped";
import isNewLine from "../utils/isNewLine";
import normalizeLabel from "../utils/normalizeLabel";

// TODO: Split this into link and image
const name = "link";

function test(state: InlineParserState, parent: MidtextNode, end: number) {
	let char = state.src[state.i];

	if (char === "[" && !isEscaped(state.src, state.i)) {
		return testLinkOpen(state, parent);
	}

	if (char === "!" && state.src[state.i + 1] === "[" && !isEscaped(state.src, state.i)) {
		return testImageOpen(state, parent);
	}

	if (char === "]" && !isEscaped(state.src, state.i)) {
		return testLinkClose(state, parent);
	}

	return false;
}

export default {
	name,
	test,
} satisfies InlineRule;

// TODO: Just take everything inside the () as a URL

function testLinkOpen(state: InlineParserState, parent: MidtextNode) {
	let markup = "[";

	state.delimiters.push({
		name: "link",
		markup,
		length: 1,
		start: state.i,
		end: -1,
		canOpen: true,
		canClose: false,
	});

	state.i += markup.length;

	return true;
}

function testImageOpen(state: InlineParserState, parent: MidtextNode) {
	let markup = "![";

	state.delimiters.push({
		name: "image",
		markup,
		length: 1,
		start: state.i,
		end: -1,
		canOpen: true,
		canClose: false,
	});

	state.i += markup.length;

	return true;
}

function testLinkClose(state: InlineParserState, parent: MidtextNode) {
	// TODO: Standardize precedence
	// For now the link takes precedence over anything else
	let startDelimiter: Delimiter | undefined;
	let startDelimiterIndex = 0;
	let i = state.delimiters.length;
	while (i--) {
		let prevDelimiter = state.delimiters[i];
		if (!prevDelimiter.handled) {
			if (prevDelimiter.markup === "[" || prevDelimiter.markup === "![") {
				startDelimiter = prevDelimiter;
				startDelimiterIndex = i;
				break;
			} else {
				continue;
			}
		}
	}

	if (startDelimiter) {
		let start = state.i + 1;
		let content = state.src.substring(startDelimiter.start + startDelimiter.markup.length, state.i);
		let label = content;
		let skip = 0;

		// "The link text may contain balanced brackets, but not
		// unbalanced ones, unless they are escaped"
		let level = 0;
		for (let i = 0; i < label.length; i++) {
			if (label[i] === "\\") {
				i++;
			} else if (label[i] === "[") {
				level++;
			} else if (label[i] === "]") {
				level--;
			}
		}
		if (level != 0) {
			return false;
		}

		let isLink = startDelimiter.markup === "[";

		let hasInfo = state.src[state.i + 1] === "(";
		let hasRef = state.src[state.i + 1] === "[";

		// "Full and compact references take precedence over shortcut references"
		// "Inline links also take precedence"
		let link: string | undefined;
		if (hasInfo) {
			start++;
			// TODO: better parsing
			for (let i = start; i < state.src.length; i++) {
				if (state.src[i] === ")" && !isEscaped(state.src, i)) {
					// TODO: Just take everything from the brackets
					link = state.src.substring(start, i).trim().split(" ")[0];
					//link = escapeBackslashes(link);
					link = encodeURI(decodeURI(escapeBackslashes(link)));
					state.i = i + 1;
					skip = i - start + 2;
					break;
				} else if (state.src[i] === "(" && !isEscaped(state.src, i)) {
					break;
				} else if (isNewLine(state.src[i])) {
					return false;
				}
			}
		} else if (hasRef) {
			start++;
			for (let i = start; i < state.src.length; i++) {
				if (state.src[i] === "]") {
					// Lookup using the text between the [], or if there
					// is no text, use the label
					label = i - start > 1 ? state.src.substring(start, i) : label;
					label = normalizeLabel(label);
					link = state.refs[label];
					if (link !== undefined) {
						state.i = i + 1;
						skip = i - start + 2;
					}
					break;
				}
			}
		}

		if (link === undefined) {
			label = normalizeLabel(label);
			link = state.refs[label];
			if (link !== undefined) {
				state.i++;
			}
		}

		if (link !== undefined) {
			// "[L]inks may not contain other links, at any level of nesting"
			if (isLink) {
				// Remove all the opening delimiters so they won't be picked up in future
				let d = state.delimiters.length;
				while (d-- > startDelimiterIndex) {
					let prevDelimiter = state.delimiters[d];
					if (prevDelimiter.markup === "[" || prevDelimiter.markup === "]") {
						prevDelimiter.handled = true;
					}
				}
			}

			state.delimiters.push({
				name,
				markup: startDelimiter.markup,
				length: 1,
				start: state.i - 1,
				end: -1,
				canOpen: false,
				canClose: true,
				info: link,
				skip,
			});

			startDelimiter.handled = false;
			return true;
		}

		// TODO: If it's not a link, go back and close delimiters that
		// weren't closed between the start and end

		startDelimiter.handled = true;
	}

	return false;
}
