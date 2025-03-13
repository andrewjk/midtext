import type Attribute from "./Attribute";

export default interface Delimiter {
	name: string;
	markup: string;
	length: number;
	start: number;
	end: number;
	canOpen: boolean;
	canClose: boolean;
	handled?: boolean;
	content?: string;
	attributes?: Attribute[];
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
