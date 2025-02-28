/**
 * Normalizes a label by performing the Unicode case fold, stripping leading and
 * trailing whitespace and collapsing consecutive internal whitespace to a
 * single space.
 */
export default function normalizeLabel(text: string) {
	return text.toLowerCase().toUpperCase().trim().replaceAll(/\s+/g, " ");
}
