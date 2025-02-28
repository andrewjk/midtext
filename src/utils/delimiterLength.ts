export default function delimiterLength(src: string, char: string, start: number) {
	// We know we already have a char, otherwise this function wouldn't be called:
	let length = 1;
	for (let i = start + 1; i < src.length; i++) {
		if (src[i] === char) {
			length++;
		} else {
			break;
		}
	}
	return length;
}
