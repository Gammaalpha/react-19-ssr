import { ReactNode } from "react";

type LanguageTypes = "en" | "fr";

type TemplateVariables = {
  pageTitle?: string;
  pageDescription?: string;
  isProduction?: boolean;
  lang?: LanguageTypes;
};

export interface IRenderTemplate {
  variables?: TemplateVariables;
  content: ReactNode;
}
