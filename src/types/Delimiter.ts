import type Attribute from "./Attribute";

export default interface Delimiter {
	name: string;
	markup: string;
	length: number;
	line: number;
	start: number;
	end: number;
	canOpen: boolean;
	canClose: boolean;
	handled?: boolean;
	content?: string;
	attributes?: Attribute[];
	/**
	 * Whether this node contains plain text content, rather than parsed and
	 * formatted text
	 */
	acceptsContent?: boolean;
	/**
	 * Additional info for the delimiter pair, like a link. It must be set on
	 * the END delimiter
	 */
	info?: string;
	/**
	 * The number of characters to skip after the delimiter pair. It must be set
	 * on the END delimiter
	 */
	skip?: number;
	/** If set to true, this delimiter will not be included in rendered output */
	hidden?: boolean;
}
