import parseBlock from "../parse/parseBlock";
import type BlockParserState from "../types/BlockParserState";
import type BlockRule from "../types/BlockRule";
import type MidtextNode from "../types/MidtextNode";
import countSpaces from "../utils/countSpaces";
import isEscaped from "../utils/isEscaped";
import newBlockNode from "../utils/newBlockNode";
import normalizeLabel from "../utils/normalizeLabel";

function testStart(state: BlockParserState) {
	if (
		state.src[state.i] === "[" &&
		state.src[state.i + 1] === "^" &&
		!isEscaped(state.src, state.i)
	) {
		let start = state.i + 1;
		let end = start;

		// Get the label
		let label = "";
		for (let i = end; i < state.src.length; i++) {
			if (!isEscaped(state.src, i)) {
				if (state.src[i] === "]") {
					label = state.src.substring(start, i);
					end = i + 1;
					break;
				}

				// Labels cannot contain brackets, unless they are escaped
				if (state.src[i] === "[") {
					return false;
				}
			}
		}

		// A label must contain at least one non-whitespace character
		if (!label || !/[^\s]/.test(label)) {
			return false;
		}

		if (state.src[end] !== ":") {
			return false;
		}

		end++;

		label = normalizeLabel(label);

		// If there are several matching definitions, the first one takes
		// precedence
		if (state.refs[label]) {
			return true;
		}

		state.refs[label] = "";

		let spaces = countSpaces(state.src, end);
		let subindent = state.indent + (end - start + 1) + spaces;

		// Create the node
		let parent = state.openNodes.at(-1)!;
		let node = newBlockNode("footnote_ref", state, "", state.indent, subindent);
		parent.children!.push(node);

		state.openNodes.push(node);

		node.info = label;

		// Parse children
		state.i = end + spaces;
		state.indent = subindent;
		parseBlock(state, state.openNodes.length - 1);

		return true;
	}

	return false;
}

function testContinue(state: BlockParserState, node: MidtextNode, hadBlankLine: boolean) {
	if (state.indent >= node.subindent) {
		return true;
	}

	if (state.openNodes.at(-1)!.name === "paragraph") {
		return true;
	}

	return false;
}

export default {
	name: "footnote_ref",
	testStart,
	testContinue,
} satisfies BlockRule;
