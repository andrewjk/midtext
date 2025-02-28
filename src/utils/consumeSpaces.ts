//import isSpace from "../utils/isSpace";

// TODO: Probably don't use this anywhere -- it doesn't take into account tabstops
export default function consumeSpaces(text: string, i: number) {
	let result = "";
	for (; i < text.length; i++) {
		let char = text[i];
		if (isSpace(text.charCodeAt(i))) {
			result += char;
		} else {
			break;
		}
	}
	return result;
}

function isSpace(code: number) {
	switch (code) {
		case 0x09: // \t
		//case 0x0a: // \n
		case 0x0b: // \v
		case 0x0c: // \f
		//case 0x0d: // \r
		case 0x20: // space
		case 0xa0: // nbsp
			return true;
		default:
			return false;
	}
}
