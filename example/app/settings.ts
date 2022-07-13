import { settings } from "quickdraw/client";

export default settings({
  site: {
    base: "http://localhost:5000",
    locale: "en_US",
    name: "Site",
  },
  nav: ["/", "/about", "/contact"],
});
