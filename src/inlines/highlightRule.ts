import type InlineParserState from "../types/InlineParserState";
import type InlineRule from "../types/InlineRule";
import standardTest from "./standardTest";

export default {
	name: "highlight",
	test: (state: InlineParserState) => standardTest(state, "highlight", "="),
} satisfies InlineRule;
