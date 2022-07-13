import { h, tw, FC } from "quickdraw/client";
import { Container } from "@app/common/container.tsx";

export const Footer: FC = () => (
  <footer class={tw`bg-white border-t border-gray-400 shadow`}>
    <Container>
      <div class={tw`w-full mx-auto flex flex-wrap`}>
        <div class={tw`flex w-full md:w-1/2`}>
          <div class={tw`p-0`}>
            <h3 class={tw`font-bold text-gray-900`}>About</h3>
            <p class={tw`py-4 text-gray-600 text-sm`}>
              Lorem ipsum dolo sit amet, consectetur adipiscing elit. Maecenas
              vel mi ut felis tempus commodo nec id erat. Suspendisse
              consectetur dapibus velit ut lacinia.
            </p>
          </div>
        </div>

        <div class={tw`flex w-full md:w-1/2`}>
          <div class={tw`p-0`}>
            <h3 class={tw`font-bold text-gray-900`}>Social</h3>
            <ul class={tw`list-none items-center text-sm pt-3`}>
              <li>
                <a
                  class={tw`inline-block text-gray-600 no-underline hover:text-gray-900 hover:text-underline py-1`}
                  href="#"
                >
                  Add social link
                </a>
              </li>
              <li>
                <a
                  class={tw`inline-block text-gray-600 no-underline hover:text-gray-900 hover:text-underline py-1`}
                  href="#"
                >
                  Add social link
                </a>
              </li>
              <li>
                <a
                  class={tw`inline-block text-gray-600 no-underline hover:text-gray-900 hover:text-underline py-1`}
                  href="#"
                >
                  Add social link
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Container>
  </footer>
);
