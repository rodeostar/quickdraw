import { h, Router, Component as NanoComponent, FC } from "../client.ts";
import type { Routes, Route, Params, RoutedProps } from "../client.ts";

export interface CommonRouterProps {
  routes: Routes;
  route: Route;
}

const DefaultError = () => <div>Oops, we couldn't find that page.</div>;

export type ComponentProps<T extends Params> = FC<T>;

export function observeRouting<T extends RoutedProps>(
  Inner: ComponentProps<T>
) {
  class WithRouteListener extends NanoComponent {
    listener = Router.Listener().use();

    constructor(props: T) {
      super(props);
      this.props = props;
    }

    didMount() {
      this.listener.subscribe((curr, prev) => {
        if (curr !== prev) {
          this.update(curr);
        }
      });
    }

    public didUnmount() {
      this.listener.cancel();
    }

    render(pathname: string) {
      const params = this.props.routes[pathname];
      const props = { ...this.props, ...(params && { params }) };
      return <Inner {...props} />;
    }
  }

  return WithRouteListener;
}

export function CommonRouter({ routes, route }: CommonRouterProps) {
  const ProvidedError =
    "/error" in routes ? routes["/error"].Component : DefaultError;

  return (
    <div id="router">
      <Router.Switch fallback={ProvidedError}>
        {Object.values(routes).map(
          (R) =>
            R.Component && (
              <Router.Route exact path={R.path}>
                <R.Component params={route} />
              </Router.Route>
            )
        )}
      </Router.Switch>
    </div>
  );
}
