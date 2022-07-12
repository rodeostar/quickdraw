import { nav } from "./vanilla/nav.ts";
import { hydrateRoutedComponents, hydrate, h } from "quickdraw/client";
import { Menu } from "./common/nav.tsx";

async function global() {
  const props = await hydrateRoutedComponents();
  hydrate(<Menu {...props} />, document.getElementById("menuItems"));
}

global();
nav();
