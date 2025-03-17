import type InlineParserState from "../types/InlineParserState";
import type MidtextNode from "../types/MidtextNode";
import escapeBackslashes from "../utils/escapeBackslashes";
import newInlineNode from "../utils/newInlineNode";

export default function parseInline(state: InlineParserState, parent: MidtextNode, end = -1) {
	// Parse inlines and get the delimiters
	let inlineEnd = end === -1 ? state.src.length : end;
	while (state.i < inlineEnd) {
		let char = state.src[state.i];
		if (end === -1 && (char === "\r" || char === "\n")) {
			// Treat Windows \r\n as \n
			if (char === "\r" && state.src[state.i + 1] === "\n") {
				state.i++;
			}

			state.line += 1;
			state.lineStarts.push(state.i + 1);
		}

		for (let rule of state.rules.values()) {
			let handled = rule.test(state);
			if (handled) {
				// TODO: Make sure that state.i has been incremented to prevent infinite loops
				break;
			}
		}
	}

	// Match the delimiters
	for (let i = 0; i < state.delimiters.length; i++) {
		let endDelimiter = state.delimiters[i];
		if (endDelimiter.canClose && !endDelimiter.handled) {
			let j = i;
			while (j--) {
				let startDelimiter = state.delimiters[j];
				if (startDelimiter.handled && startDelimiter.end > endDelimiter.start) {
					// Can't cross a delimiter that's already handled
					break;
				} else if (
					!startDelimiter.handled &&
					startDelimiter.canOpen &&
					startDelimiter.markup === endDelimiter.markup &&
					startDelimiter.length === endDelimiter.length
				) {
					startDelimiter.end = endDelimiter.start;
					startDelimiter.info = endDelimiter.info;
					startDelimiter.skip = endDelimiter.skip;
					startDelimiter.attributes = endDelimiter.attributes;

					// Mark delimiters between the start and end as handled,
					// as they can't start anything anymore
					for (let d = j; d <= i; d++) {
						state.delimiters[d].handled = true;
					}

					break;
				}
			}
		}
	}

	state.line = parent.line;
	state.delimiters = state.delimiters.filter((d) => d.end !== -1);

	// Chop up the text
	let i = processDelimiters(state, parent, -1, 0, state.src.length);
	if (i === -1) {
		let text = formatText(state.src);
		let textNode = newInlineNode("text", state, 0, state.line, text, 0);
		parent.children?.push(textNode);
	} else {
		let start = 0;
		for (let j = 0; j <= i; j++) {
			let delimiter = state.delimiters[j];
			start = Math.max(start, delimiter.end + delimiter.length);
		}
		if (start < state.src.length) {
			let text = state.src.substring(start, state.src.length);
			text = formatText(text);
			let textNode = newInlineNode("text", state, start, state.line, text, 0);
			parent.children?.push(textNode);
		}
	}
}

function processDelimiters(
	state: InlineParserState,
	parent: MidtextNode,
	index: number,
	start: number,
	end: number,
) {
	let lastHandledIndex = index;
	index = Math.max(index, 0);
	for (let i = index; i < state.delimiters.length; i++) {
		let delimiter = state.delimiters[i];
		if (delimiter.start > end) {
			break;
		}

		lastHandledIndex = i;

		// Maybe add the text between delimiters
		if (delimiter.start > start) {
			let text = state.src.substring(start, delimiter.start);
			if (!delimiter.acceptsContent) text = formatText(text);
			let textNode = newInlineNode("text", state, start, state.line, text, 0);
			parent.children!.push(textNode);
		}

		// Add the delimiter
		let markup = delimiter.markup.repeat(delimiter.length);
		let delimiterNode = newInlineNode(
			delimiter.name,
			state,
			delimiter.start,
			delimiter.line,
			markup,
			0,
		);
		delimiterNode.info = delimiter.info;
		delimiterNode.attributes = delimiter.attributes;
		if (!delimiter.hidden) {
			parent.children!.push(delimiterNode);
		}

		start = delimiter.start + markup.length;
		state.line = delimiter.line;

		if (delimiter.hidden) {
			start = delimiter.end + markup.length;
		} else if (delimiter.content) {
			let text = delimiter.content;
			if (!delimiter.acceptsContent) text = formatText(delimiter.content);
			let textNode = newInlineNode("text", state, start, delimiter.line, text, 0);
			delimiterNode.children!.push(textNode);
			start = delimiter.end + markup.length;
			state.line = delimiter.line;
		} else {
			let found = false;
			for (let j = i + 1; j < state.delimiters.length; j++) {
				let nextDelimiter = state.delimiters[j];
				if (nextDelimiter.start < delimiter.end) {
					found = true;

					// Process the delimiter's children
					j = processDelimiters(state, delimiterNode, j, start, nextDelimiter.end);
					i = j;
					lastHandledIndex = i;

					start = nextDelimiter.end + nextDelimiter.length * nextDelimiter.markup.length;
					state.line = nextDelimiter.line;
				} else {
					break;
				}
			}

			// No overlapping delimiters, so add the text
			if (!found) {
				let text = state.src.substring(start, delimiter.end - (delimiter.skip ?? 0));
				if (!delimiter.acceptsContent) text = formatText(text);
				let textNode = newInlineNode("text", state, start, delimiter.line, text, 0);
				delimiterNode.children!.push(textNode);
				start = delimiter.end + markup.length;
				state.line = delimiter.line;
			}
		}

		// Maybe add the text between delimiters
		if (delimiter.end > start) {
			// HACK: Need to account for start and end delimiters of different
			// lengths and go back to using substring
			let text = state.src.slice(start, delimiter.end - (delimiter.skip ?? 0));
			if (!delimiter.acceptsContent) text = formatText(text);
			let textNode = newInlineNode("text", state, start, delimiter.line, text, 0);
			delimiterNode.children!.push(textNode);
		}

		start = delimiter.end + markup.length;
		state.line = delimiter.line;
	}
	return lastHandledIndex;
}

function formatText(text: string) {
	text = text.replaceAll(/\s*[\r\n]\s*/g, "\n");
	text = escapeBackslashes(text);
	return text;
}
