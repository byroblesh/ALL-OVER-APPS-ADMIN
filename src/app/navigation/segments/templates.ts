import { baseNavigationObj } from "../baseNavigation";
import { NavigationTree } from "@/@types/navigation";

export const templates: NavigationTree = {
  ...baseNavigationObj["templates"],
  type: "root",
  childs: [
    {
      id: "templates.list",
      path: "/templates",
      type: "item",
      title: "Email Templates",
      transKey: "nav.templates.list",
      icon: "templates",
    },
  ],
};
