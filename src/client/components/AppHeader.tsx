import React, { useState } from "react";
import "../styles/AppHeader.module.scss";
import { useTranslation } from "react-i18next";
import LanguageToggle from "./LanguageToggle";
import { NavLink } from "react-router";

import {
  Header,
  HeaderContainer,
  HeaderNavigation,
  HeaderMenuItem,
  HeaderMenuButton,
  SideNav,
  SideNavItems,
  SideNavLink,
  HeaderName,
} from "@carbon/react";

const AppHeader = () => {
  const { t } = useTranslation();

  const [isSideNavExpanded, setIsSideNavExpanded] = useState(false);

  const handleSideNavToggle = () => {
    setIsSideNavExpanded(!isSideNavExpanded);
  };

  const navLinks = [
    {
      id: "dashboard",
      label: t("dashboard"),
      link: "/dashboard",
    },
    {
      id: "record",
      label: t("records"),
      link: "/records",
    },
  ];

  return (
    <HeaderContainer
      isSideNavExpanded={isSideNavExpanded}
      render={() => (
        <Header aria-label="react ssr app header" className="app-header">
          <HeaderMenuButton
            aria-label={isSideNavExpanded ? "Close menu" : "Open menu"}
            onClick={handleSideNavToggle}
            isActive={isSideNavExpanded}
            aria-expanded={isSideNavExpanded}
          />
          <div className="app-header__title-with-nav">
            <HeaderName prefix="" href="/" className="app-header__title">
              {t("appHeaderTitle")}
            </HeaderName>
            <HeaderNavigation aria-label="react ssr app navigation">
              {navLinks.map((nav) => (
                <HeaderMenuItem
                  key={`nav-${nav.link}`}
                  as={NavLink}
                  to={nav.link}
                >
                  {nav.label}
                </HeaderMenuItem>
              ))}
            </HeaderNavigation>
          </div>
          <SideNav
            aria-label="Side Navigation"
            expanded={isSideNavExpanded}
            onSideNavBlur={handleSideNavToggle}
            href="#main-content"
            className="site-side-nav-panel"
          >
            <SideNavItems>
              {navLinks.map((nav) => (
                <SideNavLink
                  key={`sidenav-${nav.link}`}
                  as={NavLink}
                  to={nav.link}
                >
                  {nav.label}
                </SideNavLink>
              ))}
            </SideNavItems>
          </SideNav>
          <LanguageToggle />
        </Header>
      )}
    />
  );
};

export default AppHeader;
