import { Button } from "@carbon/react";
import styles from "../../../styles/MarkdownEditor.module.scss";
import React from "react";

/**
 * @param {{ onCancel?: () => void, onSubmit?: () => void, submitLabel?: string }} props
 */
export const EditorFooter = ({
  onCancel,
  onSubmit,
  submitLabel = "Submit",
}: {
  onCancel?: () => void;
  onSubmit?: () => void;
  submitLabel?: string;
}) => {
  return (
    <div className={styles.footer}>
      <div className={styles.footerRight}>
        {onCancel && (
          <Button
            kind="secondary"
            className={`${styles.btn} ${styles.btnCancel}`}
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
        <Button
          kind="primary"
          className={`${styles.btn} ${styles.btnSubmit}`}
          onClick={onSubmit}
        >
          {submitLabel}
        </Button>
      </div>
    </div>
  );
};
