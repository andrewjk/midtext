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
			state.lineStart = state.i;
		}

		for (let rule of state.rules.values()) {
			let handled = rule.test(state, parent, inlineEnd);
			if (handled) {
				// TODO: Make sure that state.i has been incremented to prevent infinite loops
				break;
			}
		}
	}

	// Match the delimiters
	// TODO: Do this while parsing, so that we don't have to check end !== -1 all the time??
	for (let i = 0; i < state.delimiters.length; i++) {
		let endDelimiter = state.delimiters[i];
		if (endDelimiter.canClose && !endDelimiter.handled) {
			let j = i;
			while (j--) {
				let startDelimiter = state.delimiters[j];
				if (
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

	state.delimiters = state.delimiters.filter((d) => d.end !== -1);

	// Chop up the text
	let i = processDelimiters(state, parent, -1, 0, state.src.length);
	if (i === -1) {
		let text = formatText(state.src);
		let textNode = newInlineNode("text", state, text, 0);
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
			let textNode = newInlineNode("text", state, text, 0);
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
			text = formatText(text);
			let textNode = newInlineNode("text", state, text, 0);
			parent.children!.push(textNode);
		}

		// Add the delimiter
		let markup = delimiter.markup.repeat(delimiter.length);
		let delimiterNode = newInlineNode(delimiter.name, state, markup, 0, []);
		// HACK:
		delimiterNode.info = delimiter.info;
		delimiterNode.attributes = delimiter.attributes;
		if (!delimiter.hidden) {
			parent.children!.push(delimiterNode);
		}

		start = delimiter.start + delimiter.length;

		if (delimiter.hidden) {
			start = delimiter.end + delimiter.length;
		} else if (delimiter.content) {
			let text = formatText(delimiter.content);
			let textNode = newInlineNode("text", state, text, 0);
			delimiterNode.children!.push(textNode);
			start = delimiter.end + delimiter.length;
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

					start = nextDelimiter.end + nextDelimiter.length;
				} else {
					break;
				}
			}

			// No overlapping delimiters, so add the text
			if (!found) {
				let text = state.src.substring(start, delimiter.end - (delimiter.skip ?? 0));
				text = formatText(text);
				let textNode = newInlineNode("text", state, text, 0);
				delimiterNode.children!.push(textNode);

				start = delimiter.end + delimiter.length;
			}
		}

		// Maybe add the text between delimiters
		if (delimiter.end > start) {
			let text = state.src.substring(start, delimiter.end - (delimiter.skip ?? 0));
			text = formatText(text);
			let textNode = newInlineNode("text", state, text, 0);
			delimiterNode.children!.push(textNode);
			//start = delimiter.start;
		}

		start = delimiter.end + delimiter.length;
	}
	return lastHandledIndex;
}

function formatText(text: string) {
	text = text.replaceAll(/\s*[\r\n]\s*/g, "\n");
	text = escapeBackslashes(text);
	return text;
}
