import React from "react";
import Dashboard from "@client/components/Dashboard";
import RecordInput from "@client/components/RecordInput";
import OpenMaps from "@client/components/OpenMaps";

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
  {
    id: "open-maps",
    label: "openMaps",
    slug: "/openmaps",
    render: <OpenMaps />,
    isProtected: true,
  },
];
