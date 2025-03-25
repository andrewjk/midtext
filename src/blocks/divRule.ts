import type BlockParserState from "../types/BlockParserState";
import type BlockRule from "../types/BlockRule";
import type MidtextNode from "../types/MidtextNode";
import { fencedTestContinue, fencedTestStart } from "./fencedRule";

export default {
	name: "div",
	testStart: (state: BlockParserState) => fencedTestStart(state, "div", ":"),
	testContinue: (state: BlockParserState, node: MidtextNode, hadBlankLine: boolean) =>
		fencedTestContinue(state, node, hadBlankLine, ":"),
} satisfies BlockRule;
