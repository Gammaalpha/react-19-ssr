import React from "react";
import "../styles/AppHeader.module.scss";
import { useTranslation } from "react-i18next";
const AppHeader = () => {
  const { t } = useTranslation();
  return <div className="app-header">{t("appHeaderTitle")}</div>;
};

export default AppHeader;
