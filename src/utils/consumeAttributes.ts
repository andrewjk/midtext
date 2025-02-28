export default function consumeAttributes(src: string, i: number): string {
	// TODO: Ignore comments, proper parsing etc
	if (src[i] === "{") {
		for (let end = i; end < src.length; end++) {
			let char = src[end];
			if (char === "}") {
				return src.substring(i + 1, end);
			}
		}
	}
	return "";
}
