import React, { useRef, useState } from "react";
import {
  // Link,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  TextArea,
} from "@carbon/react";

// import "./MarkdownEditor.module.css";
import styles from "../../styles/MarkdownEditor.module.scss";

import { useCallback } from "react";
// import { Minimize, Maximize } from "@carbon/icons-react";
import { EditorFooter } from "./utils/EditorFooter";
import { EditorToolbar } from "./utils/EditorToolbar";
import { renderMarkdown } from "./utils/renderMarkdown";

/**
 * Returns an `insertAction` function that applies a toolbar action
 * to the textarea, correctly handling selection, wrapping, and prefixes.
 *
 * @param {string} value - Current textarea value
 * @param {(v: string) => void} setValue - State setter
 * @param {React.RefObject<HTMLTextAreaElement>} textareaRef
 */
export function useEditorActions(
  value: string,
  setValue: Function,
  textareaRef: React.RefObject<HTMLTextAreaElement | null>,
) {
  const insertAction = useCallback(
    (action: any) => {
      if (!textareaRef || !textareaRef.current) {
        return;
      }
      const el = textareaRef.current;

      const start = el.selectionStart;
      const end = el.selectionEnd;
      const selected = value.slice(start, end);
      let nextValue = value;
      let nextCursor = start;

      if (action.prefix) {
        // Insert prefix at the beginning of the current line
        const lineStart = value.lastIndexOf("\n", start - 1) + 1;
        nextValue =
          value.slice(0, lineStart) + action.prefix + value.slice(lineStart);
        nextCursor = start + action.prefix.length;
      } else if (action.wrap) {
        const [before, after] = action.wrap;
        const text = selected || action.placeholder || "";
        nextValue =
          value.slice(0, start) + before + text + after + value.slice(end);
        nextCursor = start + before.length + text.length + after.length;
      } else if (action.syntax) {
        nextValue = value.slice(0, start) + action.syntax + value.slice(end);
        nextCursor = start + action.syntax.length;
      }

      setValue(nextValue);

      // Restore focus and cursor position after React re-render
      setTimeout(() => {
        el.focus();
        el.setSelectionRange(nextCursor, nextCursor);
      }, 0);
    },
    [value, setValue, textareaRef],
  );

  const handleKeyDown = useCallback(
    (e: any) => {
      // Tab → insert 2 spaces instead of shifting focus
      if (e.key === "Tab") {
        e.preventDefault();
        const el = e.target;
        const s = el.selectionStart;
        const end = el.selectionEnd;
        const next = value.slice(0, s) + "  " + value.slice(end);
        setValue(next);
        setTimeout(() => el.setSelectionRange(s + 2, s + 2), 0);
      }
    },
    [value, setValue],
  );

  return { insertAction, handleKeyDown };
}

const MarkdownEditor = ({
  labelText = "Add information",
  initialValue = "",
  submitLabel = "Save",
  onSubmit,
  onCancel,
}: {
  labelText?: string;
  initialValue?: string;
  submitLabel?: string;
  onSubmit: (value: string) => void;
  onCancel: () => void;
}) => {
  const [value, setValue] = useState(initialValue);
  const [activeTab, setActiveTab] = useState(0);
  // const [fullscreen, setFullscreen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const { insertAction, handleKeyDown } = useEditorActions(
    value,
    setValue,
    textareaRef,
  );
  const handleSubmit = () => onSubmit?.(value);

  const prefix = "markdown-editor";
  return (
    <div className={prefix}>
      {/* Write / Preview tabs */}
      <Tabs onChange={({ selectedIndex }) => setActiveTab(selectedIndex)}>
        <TabList aria-label="Editor tabs">
          <Tab>Write</Tab>
          <Tab>Preview</Tab>
        </TabList>
        <EditorToolbar
          onAction={insertAction}
          disabled={activeTab === 1}
          charCount={value.length}
        />

        <TabPanels>
          {/* Write panel */}
          <TabPanel>
            {/* Toolbar */}

            <TextArea
              labelText={labelText}
              ref={textareaRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              aria-label="Markdown editor"
            />
          </TabPanel>

          {/* Preview panel */}
          <TabPanel>
            {value.trim() ? (
              <div
                className={styles.preview}
                dangerouslySetInnerHTML={{ __html: renderMarkdown(value) }}
                aria-label="Rendered markdown preview"
              />
            ) : (
              <div className={styles.preview}>
                <p className={styles.previewEmpty}>Nothing to preview</p>
              </div>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Footer */}
      <EditorFooter
        onCancel={onCancel}
        onSubmit={handleSubmit}
        submitLabel={submitLabel}
      />
    </div>
  );
};

export default MarkdownEditor;
