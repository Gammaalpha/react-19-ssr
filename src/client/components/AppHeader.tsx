import React from "react";
import "../styles/AppHeader.module.scss";
import { useTranslation } from "react-i18next";
import LanguageToggle from "./LanguageToggle";
import { NavLink } from "react-router";

import {
  Header,
  HeaderContainer,
  HeaderNavigation,
  HeaderMenuItem,
  Link,
} from "@carbon/react";

const AppHeader = () => {
  const { t } = useTranslation();

  const navLinks = [
    {
      id: "dashboard",
      label: t("dashboard"),
      link: "/dashboard",
    },
    {
      id: "record",
      label: t("record"),
      link: "/record",
    },
  ];

  return (
    <HeaderContainer
      render={() => (
        <Header aria-label="react ssr app" className="app-header">
          <div className="app-header__title-with-nav">
            <Link className="app-header__title" href="/">
              {t("appHeaderTitle")}
            </Link>
            <HeaderNavigation aria-label="react ssr app navigation">
              {navLinks.map((nav) => (
                <HeaderMenuItem as={NavLink} to={nav.link}>
                  {nav.label}
                </HeaderMenuItem>
              ))}
            </HeaderNavigation>
          </div>
          <LanguageToggle />
        </Header>
      )}
    />
  );
};

export default AppHeader;
