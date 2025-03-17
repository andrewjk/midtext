import type InlineParserState from "../types/InlineParserState";
import escapeBackslashes from "./escapeBackslashes";
import isEscaped from "./isEscaped";
import isNewLine from "./isNewLine";
import normalizeLabel from "./normalizeLabel";

export default function extractLink(state: InlineParserState, label: string) {
	let hasInfo = state.src[state.i + 1] === "(";
	let hasRef = state.src[state.i + 1] === "[";

	let start = state.i + 1;
	let skip = 0;

	// "Full and compact references take precedence over shortcut references"
	// "Inline links also take precedence"
	let link: string | undefined;
	if (hasInfo) {
		start++;
		// TODO: better parsing
		for (let i = start; i < state.src.length; i++) {
			if (state.src[i] === ")" && !isEscaped(state.src, i)) {
				let info = state.src.substring(start, i).trim();
				// TODO: Get rid of these
				if (info.startsWith("<") && info.endsWith(">") && info.at(-2) !== "\\") {
					info = info.substring(1, info.length - 1);
				}
				if (/\s/.test(info)) {
					break;
				}
				link = encodeURI(decodeURI(escapeBackslashes(info)));
				state.i = i + 1;
				skip = i - start + 2;
				break;
			} else if (state.src[i] === "(" && !isEscaped(state.src, i)) {
				break;
			} else if (isNewLine(state.src[i])) {
				break;
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

	return { link, skip };
}
