██████╗ ██╗   ██╗██╗ ██████╗██╗  ██╗██████╗ ██████╗  █████╗ ██╗    ██╗
██╔═══██╗██║   ██║██║██╔════╝██║ ██╔╝██╔══██╗██╔══██╗██╔══██╗██║    ██║
██║   ██║██║   ██║██║██║     █████╔╝ ██║  ██║██████╔╝███████║██║ █╗ ██║
██║▄▄ ██║██║   ██║██║██║     ██╔═██╗ ██║  ██║██╔══██╗██╔══██║██║███╗██║
╚██████╔╝╚██████╔╝██║╚██████╗██║  ██╗██████╔╝██║  ██║██║  ██║╚███╔███╔╝
 ╚══▀▀═╝  ╚═════╝ ╚═╝ ╚═════╝╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝ ╚══╝╚══╝     

# Experimental

See the [DEMO](https://rodeostar-quickdraw.deno.dev)

This framework was written in a hackathon's time, using a few awesome minimalist libraries to achieve some of the things
expected of frameworks/libraries like react+next.js. 

Over the years, I've spent an increasing amount of time trying to reduce the npm footprint of applications in production, as well
as dealing with the drawbacks of JS first frameworks. I really like the approach NanoJSX takes of SSR first, then partial hydration of areas that require interactivity. It also provides the flexibility to include performant, vanilla JS, which becomes a bit of a chore in libraries like React.

### Features

- TailwindCSS via twind (CSS in JS, but rendered server-side as static CSS)
- SEO out of the box, just export an seo object and pass properties which are typed via typescript
- Folder/filename driven api routes. I.e. /api/names/random.ts is stood up at http://basename/api/names/random
  - Powered by Oak, an HTTP framework for Deno
- Virtual DOM and JSX components, powered by NanoJSX.
- Fine tuned control over what is rendered in the browser as JS, bundled using ESBuild.

### Todo

- Support slug routing in the pages folder, i.e. /blog/[postId].tsx
- Add a user friendly equivalent to NextJS's getServerSideProps()/getStaticProps(), so that API calls can be made server side to drive initial static rendering


# Run it

`make dev`  - Development server with HMR
`make prod` - Production server, client code is bundled/minified

## CheatSheet


```
/app                           -  Root directory for your application
/app/globals.ts                -  This is vanilla JS for your client, that will be added to every page
/app/vanilla                   -  Add vanilla JS snippets here, import into globals.ts
/app/pages                     -  name.tsx is converted to a route /name, about.tsx->/about, etc
/app/.qd                       -  This is where Quickdraw stores assets, codegen, and build output
/app/.qd/assets                -  globals.ts -> /assets/globals.js, routing + PPH -> /assets/{page}.bundle.js
/app/.qd/client                -  Quickdraw stores code gen in here to support generating the client bundle.
/app/.qd/imports.ts            -  Autogenerated mapping of your pages folder, used for routing.
PPH                            -  (per page hydration) Add {page}.hydrate.tsx to /app/pages, run hydrate on a JSX component
```
