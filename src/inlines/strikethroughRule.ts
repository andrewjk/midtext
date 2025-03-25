import type InlineParserState from "../types/InlineParserState";
import type InlineRule from "../types/InlineRule";
import standardTest from "./standardTest";

const test = (state: InlineParserState) => standardTest(state, "strikethrough", "~");

export default {
	name: "strikethrough",
	test,
} satisfies InlineRule;
