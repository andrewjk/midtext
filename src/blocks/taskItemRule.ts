import type BlockParserState from "../types/BlockParserState";
import type BlockRule from "../types/BlockRule";
import type MidtextNode from "../types/MidtextNode";
import newBlockNode from "../utils/newBlockNode";

/**
 * "GFM enables the tasklist extension, where an additional processing step is
 * performed on list items.
 *
 * A task list item is a list item where the first block in it is a paragraph
 * which begins with a task list item marker and at least one whitespace
 * character before any other content.
 *
 * A task list item marker consists of an optional number of spaces, a left
 * bracket ([), either a whitespace character or the letter x in either
 * lowercase or uppercase, and then a right bracket (]).
 *
 * When rendered, the task list item marker is replaced with a semantic checkbox
 * element; in an HTML output, this would be an <input type="checkbox"> element.
 *
 * If the character between the brackets is a whitespace character, the checkbox
 * is unchecked. Otherwise, the checkbox is checked.
 *
 * This spec does not define how the checkbox elements are interacted with: in
 * practice, implementors are free to render the checkboxes as disabled or
 * inmutable elements, or they may dynamically handle dynamic interactions (i.e.
 * checking, unchecking) in the final rendered document."
 */

const name = "task_item";

function testStart(state: BlockParserState) {
	let parent = state.openNodes.at(-1)!;
	if (parent.name === "list_item") {
		let start = state.i;
		if (state.src[start] === "[" && state.src[start + 2] === "]") {
			let markup = `[${state.src[start + 1]}]`;
			let task = newBlockNode(name, state, markup, state.indent, state.indent);
			task.block = false;
			parent.children!.push(task);
			state.i = start + markup.length;
			state.indent = state.i;
		}
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
