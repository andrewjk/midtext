import type Attribute from "../types/Attribute";

/**
 * Parses block or span attributes between `{` and `}`.
 *
 * @param content The text from between `{` and `}`.
 *
 * @returns An array of Attributes.
 */
export default function parseAttributes(content: string): Attribute[] | undefined {
	// TODO: Ignore comments, proper parsing etc
	let attributes: Attribute[] = [];
	for (let a of content.replaceAll("#", " #").replaceAll(".", " .").split(" ").filter(Boolean)) {
		let [name, value] = a.split("=").map((b) => b.trim());
		if (name.startsWith("#")) {
			value = name.substring(1);
			name = "id";
		} else if (name.startsWith(".")) {
			value = name.substring(1);
			name = "class";
		}
		let att = attributes.find((a) => a.name === name);
		if (att) {
			att.value ||= "";
			att.value += " " + value;
		} else {
			if (
				(value.startsWith('"') && value.endsWith('"')) ||
				(value.startsWith('"') && value.endsWith('"'))
			) {
				value = value.substring(1, value.length - 1);
			}
			attributes.push({
				name,
				value,
			});
		}
	}
	return attributes;
}
