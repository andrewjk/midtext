import type BlockParserState from "../types/BlockParserState";
import type BlockRule from "../types/BlockRule";
import type MidtextNode from "../types/MidtextNode";
import getEndOfLine from "../utils/getEndOfLine";
import isEscaped from "../utils/isEscaped";
import isNewLine from "../utils/isNewLine";
import isSpace from "../utils/isSpace";
import newBlockNode from "../utils/newBlockNode";

function testStart(state: BlockParserState) {
	// TODO: Less work
	let parent = state.openNodes.at(-1)!;

	let char = state.src[state.i];

	if (parent.name === "table" && char !== "|") {
		state.openNodes.pop();
		return false;
	}

	let level = state.openNodes.indexOf(parent);
	let hadBlankLine = state.blankLevel !== -1 && state.blankLevel < level;

	if (!hadBlankLine && parent.name === "table" && char === "|") {
		// We may already have a table
		let endOfLine = getEndOfLine(state);

		let headers = parent.children![0].children!.map((c) => c.info);

		let row = newBlockNode("table_row", state, "", 0, 0);
		parent.children!.push(row);

		let rowContent = state.src
			.substring(state.i, endOfLine)
			.trim()
			.replaceAll(/(^\||\|$)/g, "");
		let rowParts = rowContent.split(/(?<!\\)\|/);
		rowParts.length = headers.length;

		let ri = 0;
		for (let text of rowParts) {
			let cell = newBlockNode("table_cell", state, "", 0, 0);
			cell.content = (text ?? "").trim().replaceAll("\\\|", "|");
			cell.info = headers[ri++];
			row.children!.push(cell);
		}

		state.i = endOfLine;
		return true;
	}

	let haveParagraph = parent.name === "paragraph" && /[^\s]/.test(parent.content);
	if (haveParagraph) {
		// "The delimiter row consists of cells whose only content are hyphens (-),
		// and optionally, a leading or trailing colon (:), or both, to indicate
		// left, right, or center alignment respectively"
		if (char === "|") {
			let cells: string[] = [""]; //[char === ":" ? "left" : ""];
			let end = state.i + 1;
			let lastChar = char;
			for (; end < state.src.length; end++) {
				let nextChar = state.src[end];
				if (nextChar === "|") {
					cells.push("");
					lastChar = nextChar;
				} else if (nextChar === "-") {
					lastChar = nextChar;
				} else if (nextChar === ":") {
					let x = cells.length - 1;
					if (lastChar === "|") {
						cells[x] = "left";
					} else {
						cells[x] = cells[x] ? "center" : "right";
					}
					lastChar = nextChar;
				} else if (isNewLine(nextChar)) {
					// TODO: Handle windows crlf
					end++;
					break;
				} else if (isSpace(state.src.charCodeAt(end))) {
					continue;
				} else {
					return false;
				}
			}
			if (lastChar === "|") {
				cells.pop();
			}

			// "The header row must match the delimiter row in the number of
			// cells. If not, a table will not be recognized"
			let headerCellCount = 1;
			let headerContent = parent.content.trim().replaceAll(/(^\||\|$)/g, "");
			for (let i = 0; i < headerContent.length; i++) {
				if (headerContent[i] === "|" && !isEscaped(headerContent, i)) {
					headerCellCount++;
				}
			}
			if (cells.length !== headerCellCount) {
				return false;
			}

			let header = newBlockNode("table_header", state, "", 0, 0);
			parent.children!.push(header);

			let headerParts = headerContent.split(/(?<!\\)\|/);
			let hi = 0;
			for (let text of headerParts) {
				let cell = newBlockNode("table_cell", state, "", 0, 0);
				cell.content = text.trim().replaceAll("\\\|", "|");
				cell.info = cells[hi++];
				header.children!.push(cell);
			}

			parent.name = "table";
			parent.content = "";
			parent.markup = state.src.substring(state.i, end);

			state.i = end;
			return true;
		}
	}

	return false;
}

function testContinue(state: BlockParserState, node: MidtextNode, hadBlankLine: boolean) {
	if (state.src[state.i] === "|") {
		return true;
	}

	return false;
}

export default {
	name: "table",
	testStart,
	testContinue,
} satisfies BlockRule;
