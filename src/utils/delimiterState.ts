import isPunctuation from "./isPunctuation";
import isSpace from "./isSpace";

export default function delimiterState(src: string, start: number, end: number) {
	// TODO: Better space checks including start/end of line
	let codeBefore = src.charCodeAt(start - 1);
	let spaceBefore = start === 0 || isSpace(codeBefore);
	let punctuationBefore = !spaceBefore && isPunctuation(codeBefore);

	let codeAfter = src.charCodeAt(end + 1);
	let spaceAfter = end === src.length - 1 || isSpace(codeAfter);
	let punctuationAfter = !spaceAfter && isPunctuation(codeAfter);

	// "A left-flanking delimiter run is a delimiter run that is (1) not
	// followed by Unicode whitespace, and either (2a) not followed by a
	// punctuation character, or (2b) followed by a punctuation character
	// and preceded by Unicode whitespace or a punctuation character. For
	// purposes of this definition, the beginning and the end of the line
	// count as Unicode whitespace."
	let canOpen =
		!spaceAfter && (!punctuationAfter || (punctuationAfter && (spaceBefore || punctuationBefore)));

	// "A right-flanking delimiter run is a delimiter run that is (1) not
	// preceded by Unicode whitespace, and either (2a) not preceded by a
	// punctuation character, or (2b) preceded by a punctuation character
	// and followed by Unicode whitespace or a punctuation character. For
	// purposes of this definition, the beginning and the end of the line
	// count as Unicode whitespace"
	let canClose =
		!spaceBefore && (!punctuationBefore || (punctuationBefore && (spaceAfter || punctuationAfter)));

	return { canOpen, canClose };
}
