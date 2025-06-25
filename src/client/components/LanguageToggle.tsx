import { Toggle } from "@carbon/react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "../styles/LanguageToggle.module.scss";

const LanguageToggle = () => {
  const { i18n, t } = useTranslation();
  const [isToggled, setIsToggled] = useState(
    i18n.language.toLowerCase() === "fr-ca"
  );

  const handleToggle = (isEnglish: boolean) => {
    // false for EN, true for FR
    if (isEnglish) {
      i18n.changeLanguage("fr-ca");
      setIsToggled(true);
    } else {
      i18n.changeLanguage("en-ca");
      setIsToggled(false);
    }
  };

  return (
    <div className="language-toggle">
      <Toggle
        id="language-toggle"
        onToggle={handleToggle}
        labelA="EN"
        labelB="FR"
        labelText={t("language")}
        toggled={isToggled}
      />
    </div>
  );
};

export default LanguageToggle;
