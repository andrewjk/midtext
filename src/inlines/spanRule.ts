import type InlineParserState from "../types/InlineParserState";
import type InlineRule from "../types/InlineRule";
import standardTest from "./standardTest";

export default {
	name: "span",
	test: (state: InlineParserState) => standardTest(state, "span", ":"),
} satisfies InlineRule;
