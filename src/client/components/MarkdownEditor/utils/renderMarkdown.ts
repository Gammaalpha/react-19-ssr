import { marked } from "marked";
import DOMPurify from "dompurify";

// Configure marked for GitHub Flavored Markdown
marked.setOptions({
  breaks: true, // convert single \n to <br>
  gfm: true, // tables, strikethrough, task lists, etc.
});

/**
 * Parses markdown to sanitized HTML.
 * @param {string} md - Raw markdown string
 * @returns {string} - Safe HTML string
 */
export function renderMarkdown(md: string) {
  if (!md) return "";
  const rawHtml: any = marked.parse(md);
  return DOMPurify.sanitize(rawHtml, {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ["script", "style"],
    FORBID_ATTR: ["onerror", "onload", "onclick"],
  });
}
