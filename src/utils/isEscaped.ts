export default function isEscaped(text: string, i: number) {
	return text[i - 1] === "\\" && text[i - 2] !== "\\";
}
