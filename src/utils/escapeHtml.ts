const HTML_ESCAPES: Record<string, string> = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	'"': "&quot;",
};

export default function escapeHtml(text: string) {
	return text.replace(/[&<>"]/g, (char) => {
		return HTML_ESCAPES[char];
	});
}
