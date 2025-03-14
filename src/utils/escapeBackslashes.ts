export default function escapeBackslashes(text: string) {
	return text.replaceAll(/\\(.)/g, "$1");
}
