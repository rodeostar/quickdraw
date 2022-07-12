import type { FC, Request, Response } from "quickdraw";
import { SEOProps } from "quickdraw";

export type RoutedProps = { routes: Routes; params?: Route };

export type Routes = Record<string, Route>;

export type APIHandler = (req: Request, res: Response) => void;

export type Params =
  | {
      params?: Route;
    }
  | undefined;

export type Route = {
  Component?: FC<Params>;
  path: string;
  name: string;
  seo?: SEOProps;
  js?: string;
  importPath?: string;
  handler?: APIHandler;
};

export type BundleMode = "production" | "development";

export type CDNPrefix = "localhost" | string;

export type QuickdrawOptions = {
  cdn: CDNPrefix;
  mode: BundleMode;
};
