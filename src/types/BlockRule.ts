import type BlockParserState from "./BlockParserState";
import type MidtextNode from "./MidtextNode";

export default interface BlockRule {
	/**
	 * The name for this rule, which must also be used for nodes created by this
	 * rule.
	 */
	name: string;
	/**
	 * Tests whether a node should start e.g. a block quote should start when we
	 * find a '>'.
	 * @param state
	 * @param parent
	 * @returns
	 */
	testStart: (state: BlockParserState) => boolean;
	/**
	 * Tests whether a node should continue after being started e.g. a block
	 * quote should continue if we find a '>'.
	 * @param state
	 * @param node
	 * @returns
	 */
	testContinue: (state: BlockParserState, node: MidtextNode, hadBlankLine: boolean) => boolean;
	/**
	 * Does any cleanup for this rule's node when it is closed.
	 * @param state
	 * @param parent
	 * @returns
	 */
	closeNode?: (state: BlockParserState, parent: MidtextNode) => void;
	/**
	 * Whether the block created by this rule accepts plain content for e.g.
	 * code blocks and raw blocks
	 */
	acceptsContent?: boolean;
}
