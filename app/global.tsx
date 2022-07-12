import { nav } from "./vanilla/nav.ts";
import { hydrateRoutedComponents, hydrate, h } from "quickdraw/client";
import { Menu } from "./common/nav.tsx";

async function global() {
  const props = await hydrateRoutedComponents();

  // Hydrate the menu so SPA routing works.
  hydrate(<Menu {...props} />, document.getElementById("menuItems"));

  if (props.params.path === "/") {
    import("@app/common/ui/names.tsx").then(({ Names }) => {
      hydrate(<Names />, document.getElementById("names"));
    });
  }
}

global();
nav();
