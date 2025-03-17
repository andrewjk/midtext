import type BlockParserState from "../types/BlockParserState";
import type BlockRule from "../types/BlockRule";
import type MidtextNode from "../types/MidtextNode";
import escapeBackslashes from "../utils/escapeBackslashes";
import getEndOfLine from "../utils/getEndOfLine";
import isEscaped from "../utils/isEscaped";
import isNewLine from "../utils/isNewLine";
import isSpace from "../utils/isSpace";
import newInlineNode from "../utils/newInlineNode";
import normalizeLabel from "../utils/normalizeLabel";

/**
 * "A link reference definition consists of a link label, indented up to three
 * spaces, followed by a colon (:), optional whitespace (including up to one
 * line ending), a link destination, optional whitespace (including up to one
 * line ending), and an optional link title, which if it is present must be
 * separated from the link destination by whitespace. No further non-whitespace
 * characters may occur on the line.
 *
 * A link reference definition does not correspond to a structural element of a
 * document. Instead, it defines a label which can be used in reference links
 * and reference-style images elsewhere in the document. Link reference
 * definitions can come either before or after the links that use them."
 */

const name = "link_ref";

function testStart(state: BlockParserState) {
	//if (parent.acceptsContent) {
	//	return false;
	//}

	// TODO: Should actually return false if there is a title / any characters
	// on the same line after the url

	let char = state.src[state.i];
	if (char === "[" && !isEscaped(state.src, state.i)) {
		// "A link reference definition cannot interrupt a paragraph"
		//if (parent.type === "paragraph" && !parent.blankAfter) {
		//	return false;
		//}

		let start = state.i + 1;

		// Get the label
		let label = "";
		for (let i = start; i < state.src.length; i++) {
			if (!isEscaped(state.src, i)) {
				if (state.src[i] === "]") {
					label = state.src.substring(start, i);
					start = i + 1;
					break;
				}

				// "Link labels cannot contain brackets, unless they are
				// backslash-escaped"
				if (state.src[i] === "[") {
					return false;
				}
			}
		}
		// "A link label must contain at least one non-whitespace character"
		if (!label || !/[^\s]/.test(label)) {
			return false;
		}

		if (state.src[start] !== ":") {
			return false;
		}

		start++;

		// TODO: The url should be able to span multiple lines
		let url = "";
		let pointy = false;
		let end = start;
		let started = false;
		let multiline = false;
		for (; end < state.src.length; end++) {
			if (started) {
				if (pointy) {
					if (state.src[end] === ">") {
						break;
					}
				} else if (multiline) {
					if (isNewLine(state.src[end])) {
						break;
					}
				} else if (isSpace(state.src.charCodeAt(end))) {
					break;
				}
			} else {
				// TODO: Would be nice to support url on several lines
				if (isNewLine(state.src[end])) {
					if (multiline) {
						break;
					}
					multiline = true;
				} else if (!isSpace(state.src.charCodeAt(end))) {
					start = end;
					if (state.src[end] === "<") {
						pointy = true;
						start++;
					}
					started = true;
				}
			}
		}
		url = state.src.substring(start, end).trim();
		if (!pointy && !url.length) {
			return false;
		}

		url = encodeURI(decodeURI(escapeBackslashes(url)));

		if (pointy) {
			end++;
		}
		state.i = end;

		// "As noted in the section on Links, matching of labels is
		// case-insensitive (see matches)"
		label = normalizeLabel(label);

		// "If there are several matching definitions, the first one takes
		// precedence"
		if (state.refs[label]) {
			return true;
		}

		state.refs[label] = url;

		let ref = newInlineNode(name, state, "", 0, []);

		state.openNodes.at(-1)!.children!.push(ref);

		// HACK: We are just swallowing everything at the end of the line so
		// that we can ignore titles, but we should return false if anything is
		// found instead
		state.i = getEndOfLine(state);

		return true;
	}

	return false;
}

function testContinue(state: BlockParserState, node: MidtextNode, hadBlankLine: boolean) {
	return false;
}

export default {
	name,
	testStart,
	testContinue,
} satisfies BlockRule;
