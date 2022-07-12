import { h, hydrate } from "quickdraw/client";

import("@app/common/ui/names.tsx").then(({ Names }) => {
  hydrate(<Names />, document.getElementById("names"));
});
