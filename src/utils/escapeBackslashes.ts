import { isNumeric } from "./isAlphaNumeric";
import isPunctuation from "./isPunctuation";

export default function escapeBackslashes(text: string) {
	let result = "";
	for (let i = 0; i < text.length; i++) {
		let char = text[i];
		if (char === "\\") {
			// CommonMark only supports escaping punctuation, but we also allow
			// escaping numbers, so that the author can escape ordered lists
			let code = text.charCodeAt(i + 1);
			if (isNumeric(code) || isPunctuation(code)) {
				i++;
				char = text[i];
			}
		}
		result += char;
	}
	return result;
}
