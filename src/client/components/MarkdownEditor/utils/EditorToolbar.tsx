import React from "react";
import { Tooltip } from "@carbon/react";
import styles from "../../../styles/MarkdownEditor.module.scss";
import { TOOLBAR_ACTIONS } from "./constants";

export const EditorToolbar = ({
  onAction,
  disabled,
  charCount,
}: {
  onAction: (action: object) => void;
  disabled: boolean;
  charCount: number;
}) => {
  return (
    <div className={styles.toolbar}>
      {TOOLBAR_ACTIONS.map((action: any, i) =>
        action.divider ? (
          <div key={i} className={styles.toolbarDivider} />
        ) : (
          <Tooltip key={i} label={action.label} align="bottom">
            <button
              className={styles.toolbarBtn}
              disabled={disabled}
              onClick={() => onAction(action)}
              aria-label={action.label}
            >
              <action.icon size={16} />
            </button>
          </Tooltip>
        ),
      )}

      <span className={styles.charBadge} aria-live="polite">
        {charCount.toLocaleString()} chars
      </span>
    </div>
  );
};
