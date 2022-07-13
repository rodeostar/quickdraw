import { h, Helmet, Fragment, QuickdrawSettings } from "../mod.ts";

export interface SEOProps {
  description?: string;
  title?: string;
  type?: string;
  path?: string;
  locale?: string;
  image?: string;
  settings: QuickdrawSettings;
}

export function SearchOpt(seo: SEOProps) {
  const { settings } = seo;
  return (
    <Helmet>
      {seo?.title && settings?.site?.name && (
        <>
          <title>
            {seo.title} | {settings.site.name}
          </title>
          <meta
            name="og:title"
            content={[settings.site.name, seo.title].join(" - ")}
          />
          <meta name="og:site_name" content={settings.site.name} />
        </>
      )}

      {seo?.description && (
        <>
          <meta name="description" content={seo.description} />
          <meta name="og:description" content={seo.description} />
        </>
      )}

      <meta name="og:type" content={seo?.type || "website"} />

      {seo?.path && settings?.site?.base && (
        <>
          <link
            rel="canonical"
            href={[settings.site.base, seo.path].join("")}
          />
          <meta
            name="og:url"
            content={[settings.site.base, seo.path].join("")}
          />
        </>
      )}

      {settings?.site?.locale && (
        <meta name="og:locale" content={settings.site.locale} />
      )}

      {seo?.image && <meta name="og:image" content={seo.image} />}
    </Helmet>
  );
}
