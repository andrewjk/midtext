import markdownit from "markdown-it";
import mditfootnote from "markdown-it-footnote";
import { micromark } from "micromark";
import { gfm, gfmHtml } from "micromark-extension-gfm";
import fs from "node:fs";
import { Bench } from "tinybench";
import parse from "../src/parse";
import renderHtml from "../src/renderHtml";

// Markdown file from https://gist.github.com/allysonsilva/85fff14a22bbdf55485be947566cc09e

const markdownFile = "./full-markdown.md";
const markdownSource = fs.readFileSync(markdownFile).toString();
const markdownHtmlFile = "./full-markdown.html";
fs.writeFileSync(
	markdownHtmlFile,
	micromark(markdownSource, {
		extensions: [gfm()],
		htmlExtensions: [gfmHtml()],
	})
		.replaceAll("del>", "s>")
		.replaceAll('disabled=""', "disabled")
		.replaceAll('checked=""', "checked"),
);

const midtextFile = "./full-midtext.mt";
const midtextSource = fs.readFileSync(midtextFile).toString();
const midtextHtmlFile = "./full-midtext.html";
const root = parse(midtextSource);
fs.writeFileSync(midtextHtmlFile, renderHtml(root));

const md = markdownit().use(mditfootnote);
const encode = md.utils.lib.mdurl.encode;
md.normalizeLink = (url: string) => encode(url);
md.normalizeLinkText = (str: string) => str;
fs.writeFileSync(
	"./full-markdown-it.html",
	md
		.render(markdownSource)
		.replaceAll("del>", "s>")
		.replaceAll('disabled=""', "disabled")
		.replaceAll('checked=""', "checked"),
);

const bench = new Bench({ name: "simple benchmark", time: 100 });

bench
	.add("markdown-it", () => {
		// Replace normalizers to more primitive, for more "honest" compare.
		// Default ones can cause 1.5x slowdown.
		const md = markdownit();
		const encode = md.utils.lib.mdurl.encode;
		md.normalizeLink = (url: string) => encode(url);
		md.normalizeLinkText = (str: string) => str;
		md.render(markdownSource);
	})
	.add("micromark", () => {
		micromark(markdownSource, {
			extensions: [gfm()],
			htmlExtensions: [gfmHtml()],
		});
	})
	.add("midtext", () => {
		const doc = parse(midtextSource);
		renderHtml(doc);
	});

await bench.run();

console.log(bench.name);
console.table(bench.table());
