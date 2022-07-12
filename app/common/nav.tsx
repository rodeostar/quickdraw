import { h, tw, Router, observeRouting } from "quickdraw/client";
import settings from "@app/settings.ts";

export const Menu = observeRouting(({ routes, params }) => {
  const navItems = settings.nav
    .filter((i) => !!routes[i])
    .map((i) => routes[i]);

  return (
    <div
      class={tw`w-full flex-grow lg:flex lg:items-center lg:w-auto hidden lg:block mt-2 lg:mt-0 bg-gray-100 md:bg-transparent z-20`}
      id="nav-content"
    >
      <ul
        id="menuItems"
        class={tw`list-none lg:flex justify-end flex-1 items-center`}
      >
        {navItems.map(({ path, name }) => (
          <li class={tw`mr-3`}>
            <Router.Link
              to={path}
              class={tw`inline-block py-2 px-4 font-medium text-gray-900 no-underline uppercase ${
                params?.path === path ? "border-b border-blue-400" : ""
              }`}
            >
              {name}
            </Router.Link>
          </li>
        ))}
      </ul>
    </div>
  );
});

export const Nav = observeRouting(({ routes, params }) => {
  return (
    <nav id="header" class={tw`fixed w-full z-10 top-0`}>
      <div
        id="progress"
        class={tw`h-1 z-20 top-0`}
        style="
      background: linear-gradient(
        to right,
        #4dc0b5 var(--scroll),
        transparent 0
      );
    "
      />

      <div
        class={tw`w-full md:max-w-4xl mx-auto flex flex-wrap items-center justify-between mt-0 py-3`}
      >
        <div>
          <a
            class={tw`text-gray-900 text-base no-underline hover:no-underline font-extrabold text-xl`}
            href="#"
          >
            Quickdraw
          </a>
        </div>

        <div class={tw`lg:hidden pr-4`}>
          <button
            id="nav-toggle"
            class={tw`flex items-center px-3 py-2 border rounded text-gray-500 border-gray-600 hover:text-gray-900 hover:border-green-500 appearance-none focus:outline-none`}
          >
            <svg
              class={tw`fill-current h-3 w-3`}
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
          </button>
        </div>

        <div
          class={tw`w-full flex-grow lg:flex lg:items-center lg:w-auto hidden lg:block mt-2 lg:mt-0 md:bg-transparent z-20`}
        >
          <Menu routes={routes} params={params} />
        </div>
      </div>
    </nav>
  );
});
