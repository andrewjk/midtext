export default function countChars(text: string, start: number, char: string) {
	for (let i = start; i < text.length; i++) {
		if (text[i] !== char) {
			return i - start;
		}
	}
	return 0;
}
