import { h, tw, FC } from "quickdraw/client";

type Props = {
  children: HTMLElement;
};

export const Container: FC<Props> = ({ children }) => (
  <div
    class={tw`w-full md:max-w-4xl mx-auto flex flex-wrap items-center justify-between mt-12 py-3 pb-12`}
  >
    {children}
  </div>
);
