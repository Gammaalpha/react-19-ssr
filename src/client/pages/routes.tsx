import React from "react";
import Dashboard from "@client/components/Dashboard";
import RecordInput from "@client/components/RecordInput";

export const navLinks = [
  {
    id: "dashboard",
    label: "dashboard",
    slug: "/dashboard",
    render: <Dashboard />,
    isProtected: true,
  },
  {
    id: "records",
    label: "records",
    slug: "/records",
    render: <RecordInput />,
    isProtected: true,
  },
];
