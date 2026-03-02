import {
  TextBold,
  TextItalic,
  Quotes,
  Code,
  ListBulleted,
  ListNumbered,
  TaskAdd,
  TextAlignLeft,
  Image,
  Link,
} from "@carbon/icons-react";

export const TOOLBAR_ACTIONS = [
  {
    icon: TextBold,
    label: "Bold",
    wrap: ["**", "**"],
    placeholder: "bold text",
  },
  {
    icon: TextItalic,
    label: "Italic",
    wrap: ["_", "_"],
    placeholder: "italic text",
  },
  { divider: true },
  { icon: Quotes, label: "Quote", prefix: "> " },
  { icon: Code, label: "Code", wrap: ["`", "`"], placeholder: "code" },
  {
    icon: Link,
    label: "Link",
    wrap: ["[", "](url)"],
    placeholder: "link text",
  },
  { divider: true },
  { icon: ListBulleted, label: "Bulleted list", prefix: "- " },
  { icon: ListNumbered, label: "Numbered list", prefix: "1. " },
  { icon: TaskAdd, label: "Task list", prefix: "- [ ] " },
  { divider: true },
  { icon: Image, label: "Image", syntax: "![alt text](url)" },
  { icon: TextAlignLeft, label: "Heading", prefix: "## " },
];
