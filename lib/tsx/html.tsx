import {
  h,
  Fragment,
  renderSSR,
  Helmet,
  getStyleTag,
  SearchOpt,
  Route,
  Routes,
} from "quickdraw";

import { CommonRouter } from "quickdraw/client";
import { Layout } from "@app/common/layout.tsx";
import { sheet } from "../tailwind.ts";

function naiveMinify(html: string) {
  if (Deno.env.get("MODE") === "production") {
    return html
      .replace(/\n/g, "")
      .replace(/[\t ]+\</g, "<")
      .replace(/\>[\t ]+\</g, "><")
      .replace(/\>[\t ]+$/g, ">");
  }

  return html;
}

export const html = (routes: Routes, route: Route) => {
  const ssr = renderSSR(() => (
    <Layout routes={routes} params={route}>
      <Fragment>
        {route?.seo && <SearchOpt {...route.seo} />}
        <CommonRouter routes={routes} route={route} />
      </Fragment>
    </Layout>
  ));

  const { body, head, footer } = Helmet.SSR(ssr);
  const styleTag = getStyleTag(sheet);

  return naiveMinify(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        ${
          Deno.env.get("MODE") === "development"
            ? '<meta http-equiv="Cache-control" content="no-cache">'
            : ""
        }
        ${head.join("\n")}
        ${styleTag}
      </head>
      <body>
        ${body}
        ${footer.join("\n")}
        ${route?.js ? route.js : ""}
      </body>
    </html>`);
};
