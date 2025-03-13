import type Attribute from "./Attribute";

export const BLOCK_NODE = 0;
export const LEAF_NODE = 1;
export const PARAGRAPH_NODE = 2;
export const INLINE_NODE = 3;

export default interface MarkdownNode {
	type: string;
	block: boolean;
	offset: number;
	/** The line number */
	line: number;
	/** The column number */
	column: number;
	/** The markdown-specific markup for this node as it has been entered by the user */
	markup: string;
	/** The delimiter that has determined this node's type */
	delimiter: string;
	/** The text content for this node */
	content: string;
	/** The number of (logical, not physical) spaces this node starts after */
	indent: number; // TODO: Just use column?
	/** For list item nodes, the number of (logical, not physical) spaces its content starts after */
	subindent: number;
	/** Whether this node has a blank line before it */
	blankBefore?: boolean;
	/** Whether this node is a loose list */
	loose?: boolean;
	/** Whether this node contains plain text content, rather than parsed Markdown */
	acceptsContent?: boolean;
	/** The node's children, if applicable */
	children?: MarkdownNode[];
	/** The node's attributes, if applicable */
	attributes?: Attribute[];
	/** Additional info for the node */
	info?: string;
}
