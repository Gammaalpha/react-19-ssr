import { Toggle } from "@carbon/react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "../styles/LanguageToggle.module.scss";

const LanguageToggle = () => {
  const { i18n, t } = useTranslation();
  const [isToggled, setIsToggled] = useState(
    i18n.language.toLowerCase() === "fr-ca"
  );
  const langSessionStorage = window.sessionStorage.getItem("react-ssr:lang");

  const handleToggle = (isFrench: boolean) => {
    // false for EN, true for FR
    let lang = "";
    if (isFrench) {
      i18n.changeLanguage("fr-ca");
      lang = "fr-ca";
      setIsToggled(true);
    } else {
      i18n.changeLanguage("en-ca");
      lang = "en-ca";
      setIsToggled(false);
    }
    if (langSessionStorage !== lang) {
      window.sessionStorage.setItem("react-ssr:lang", lang);
    }
  };

  useEffect(() => {
    if (
      i18n.language.toLowerCase() !== langSessionStorage &&
      langSessionStorage
    ) {
      handleToggle(langSessionStorage === "fr-ca");
    }
  }, []);

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
