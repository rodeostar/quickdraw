import { h, tw } from "quickdraw/client";
import { Names } from "../common/ui/names.tsx";

const Home = () => (
  <div>
    <div class={tw`font-sans pb-2`}>
      <h1
        class={tw`font-medium font-sans break-normal text-gray-900 pt-2 mt-6 pb-2 text-3xl md:text-4xl`}
      >
        Blazing fast microframework.
      </h1>
    </div>

    <p class={tw`pt-0 pb-2`}>
      <strong>Deno</strong> + <strong>NanoJSX</strong> microframework for modern
      application development.
    </p>

    <p class={tw`pt-6 pb-2 font-medium`}>Features:</p>

    <ol>
      <li class={tw`pb-1`}>- TailwindCSS</li>
      <li class={tw`pb-1`}>- JSX Templates (SSR/CSR)</li>
      <li class={tw`pb-1`}>- Fully typescript, runs on Deno</li>
      <li class={tw`pb-1`}>- Development server with HMR</li>
    </ol>

    <p class={tw`pt-6 pb-2 font-medium`}>Goals:</p>

    <ol class={tw`pb-6`}>
      <li class={tw`pb-1`}>- Flexibility</li>
      <li class={tw`pb-1`}>- Developer Ergonomics</li>
      <li class={tw`pb-1`}>- Lightweight internals</li>
      <li class={tw`pb-1`}>- Trend toward SSR</li>
    </ol>

    <p class={tw`pb-2 font-medium`}>
      This page is static, except for a small vanilla JS snippet and the
      following hydrated JSX component:
    </p>

    <div class={tw`pb-6`}>
      <Names />
    </div>
  </div>
);

export default Home;

export const seo = {
  title: "Getting Started",
  description: "Blazing fast microframework. All typescript, runs on deno.",
  path: "/",
  image:
    "https://www.adaptivewfs.com/wp-content/uploads/2020/07/logo-placeholder-image.png",
};
