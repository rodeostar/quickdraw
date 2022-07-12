export type QuickdrawSettings = {
  site: {
    base: string;
    locale: string;
    name: string;
  };
  nav: string[];
};

export const defaultConfig = {
  site: {
    base: "http://localhost:5000",
    locale: "en_US",
    name: "Site",
  },
  nav: ["/", "/about"],
};

export default (settings?: QuickdrawSettings) => {
  return settings ?? defaultConfig;
};
