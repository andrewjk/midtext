// TODO: Should probably take tabs into account
export default function countSpaces(text: string, start: number) {
	for (let i = start; i < text.length; i++) {
		if (!isSpace(text.charCodeAt(i))) {
			return i - start;
		}
	}
	return 0;
}

// Don't count newlines
function isSpace(code: number) {
	switch (code) {
		case 0x09: // \t
		case 0x0b: // \v
		case 0x0c: // \f
		case 0x20: // space
		case 0xa0: // nbsp
			return true;
		default:
			return false;
	}
}
