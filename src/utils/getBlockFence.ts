import isEscaped from "./isEscaped";
import isNewLine from "./isNewLine";
import isSpace from "./isSpace";

export function getBlockFence(
	src: string,
	char: string,
	start: number,
	allowInfo: boolean,
): string | void {
	if (src[start] === char && !isEscaped(src, start)) {
		let matched = 1;
		let end = start + 1;
		let haveSpace = false;
		for (; end < src.length; end++) {
			let nextChar = src[end];
			if (nextChar === char) {
				if (haveSpace) {
					return;
				}
				matched++;
			} else if (isNewLine(nextChar)) {
				break;
			} else if (isSpace(src.charCodeAt(end))) {
				haveSpace = true;
			} else {
				if (!allowInfo) {
					return;
				}
				break;
			}
		}
		return char.repeat(matched);
	}
}
