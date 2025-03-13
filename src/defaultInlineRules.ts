import codeSpanRule from "./inlines/codeSpanRule";
import commentSpanRule from "./inlines/commentSpanRule";
import emphasisRule from "./inlines/emphasisRule";
import hardBreakRule from "./inlines/hardBreakRule";
import highlightRule from "./inlines/highlightRule";
import linkRule from "./inlines/linkRule";
import rawSpanRule from "./inlines/rawSpanRule";
import spanAttributesRule from "./inlines/spanAttributesRule";
import spanRule from "./inlines/spanRule";
import strikethroughRule from "./inlines/strikethroughRule";
import superscriptRule from "./inlines/superscriptRule";
import textRule from "./inlines/textRule";
import type InlineRule from "./types/InlineRule";

export default function defaultInlineRules() {
	let rules = new Map<string, InlineRule>();
	rules.set(spanAttributesRule.name, spanAttributesRule);
	rules.set(rawSpanRule.name, rawSpanRule);
	rules.set(codeSpanRule.name, codeSpanRule);
	rules.set(emphasisRule.name, emphasisRule);
	rules.set(strikethroughRule.name, strikethroughRule);
	rules.set(highlightRule.name, highlightRule);
	rules.set(superscriptRule.name, superscriptRule);
	rules.set(linkRule.name, linkRule);
	rules.set(spanRule.name, spanRule);
	rules.set(hardBreakRule.name, hardBreakRule);
	rules.set(commentSpanRule.name, commentSpanRule);
	rules.set(textRule.name, textRule);
	return rules;
}
