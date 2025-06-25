import React from "react";
import "../styles/AppHeader.module.scss";
import { useTranslation } from "react-i18next";
import LanguageToggle from "./LanguageToggle";

const AppHeader = () => {
  const { t } = useTranslation();
  return (
    <div className="app-header">
      <div>{t("appHeaderTitle")}</div>
      <div>
        <LanguageToggle />
      </div>
    </div>
  );
};

export default AppHeader;
