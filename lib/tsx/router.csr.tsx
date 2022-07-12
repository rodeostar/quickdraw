import { h, hydrate, FC, CommonRouter, Routes, Route } from "quickdraw/client";

export type HydrateArgs<T> = Array<[FC<T>, string]>;

export type HydrationCallback = (params: {
  routes: Routes;
  params: Route;
}) => void;

export async function hydrateRoutedComponents() {
  return await import("@app/.qd/imports.ts").then(({ default: Routes }) => {
    const route = Routes[window.location.pathname];

    hydrate(
      <CommonRouter routes={Routes} route={route} />,
      document.getElementById("router")
    );

    return {
      params: route,
      routes: Routes,
    };
  });
}
