import type BlockParserState from "../types/BlockParserState";
import type BlockRule from "../types/BlockRule";
import type MarkdownNode from "../types/MarkdownNode";
import escapeBackslashes from "../utils/escapeBackslashes";
import { getBlockFence } from "../utils/getBlockFence";
import getEndOfLine from "../utils/getEndOfLine";
import isNewLine from "../utils/isNewLine";
import newBlockNode from "../utils/newBlockNode";

/**
 * "A code fence is a sequence of at least three consecutive backtick characters
 * (`) or tildes (~). (Tildes and backticks cannot be mixed.) A fenced code
 * block begins with a code fence, indented no more than three spaces.
 *
 * The line with the opening code fence may optionally contain some text
 * following the code fence; this is trimmed of leading and trailing whitespace
 * and called the info string. If the info string comes after a backtick fence,
 * it may not contain any backtick characters. (The reason for this restriction
 * is that otherwise some inline code would be incorrectly interpreted as the
 * beginning of a fenced code block.)
 *
 * The content of the code block consists of all subsequent lines, until a
 * closing code fence of the same type as the code block began with (backticks
 * or tildes), and with at least as many backticks or tildes as the opening code
 * fence. If the leading code fence is indented N spaces, then up to N spaces of
 * indentation are removed from each line of the content (if present). (If a
 * content line is not indented, it is preserved unchanged. If it is indented
 * less than N spaces, all of the indentation is removed.)
 *
 * The closing code fence may be indented up to three spaces, and may be
 * followed only by spaces, which are ignored. If the end of the containing
 * block (or document) is reached and no closing code fence has been found, the
 * code block contains all of the lines after the opening code fence until the
 * end of the containing block (or document). (An alternative spec would require
 * backtracking in the event that a closing code fence is not found. But this
 * makes parsing much less efficient, and there seems to be no real down side to
 * the behavior described here.)
 *
 * A fenced code block may interrupt a paragraph, and does not require a blank
 * line either before or after.
 *
 * The content of a code fence is treated as literal text, not parsed as
 * inlines. The first word of the info string is typically used to specify the
 * language of the code sample, and rendered in the class attribute of the code
 * tag. However, this spec does not mandate any particular treatment of the info
 * string."
 */

const name = "div";

function testStart(state: BlockParserState, parent: MarkdownNode) {
	let markup = getBlockFence(state.src, ":", state.i, true);
	if (markup && markup.length >= 3) {
		let end = state.i + markup.length;

		let attributes = state.attributes ?? [];
		if (!isNewLine(state.src[state.i + markup.length])) {
			end = getEndOfLine(state);
			let info = state.src.substring(state.i + markup.length, end).trim();
			// HACK: do this more efficiently
			if (info.length) {
				// Info can't contain spaces or backticks
				if (/[\s:]/.test(info)) {
					return false;
				}
				info = escapeBackslashes(info);
				attributes.push({ name: "class", value: `language-${info}` });
			}
		} else {
			end++;
		}

		// Remove any open nodes that start further to the right than this one,
		// as well as any open paragraphs
		let i = state.openNodes.length;
		while (i-- > 1) {
			let node = state.openNodes[i];
			if (node.subindent > state.indent || node.type === "paragraph") {
				state.openNodes.length = i;
			}
		}
		parent = state.openNodes.at(-1)!;

		let divNode = newBlockNode(name, state.i, state.line, 1, markup, state.indent);
		divNode.subindent = state.indent;
		if (attributes.length) {
			divNode.attributes = attributes;
		}
		delete state.attributes;

		let level = state.openNodes.indexOf(parent);
		if (state.blankLevel !== -1 && state.blankLevel <= level) {
			divNode.blankBefore = true;
			state.blankLevel = -1;
		}

		parent.children!.push(divNode);
		state.openNodes.push(divNode);

		state.i = end;

		return true;
	}

	return false;
}

function testContinue(state: BlockParserState, node: MarkdownNode) {
	let level = state.openNodes.indexOf(node);
	let hadBlankLine = state.blankLevel !== -1 && state.blankLevel < level;

	if (!hadBlankLine && state.indent < node.subindent) {
		return false;
	}

	let markup = getBlockFence(state.src, ":", state.i, false);
	if (markup && markup.length >= node.markup.length) {
		state.i += markup.length;
		return false;
	}

	return true;
}

export default {
	name,
	testStart,
	testContinue,
} satisfies BlockRule;
