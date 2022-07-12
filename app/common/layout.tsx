import { h, tw, FC, Routes, Route } from "quickdraw/client";
import { Nav } from "@app/common/nav.tsx";
import { Footer } from "@app/common/footer.tsx";
import { Container } from "@app/common/container.tsx";

type Props = {
  children: HTMLElement;
  routes: Routes;
  params: Route;
};

export const Layout: FC<Props> = ({ children, routes, params }) => (
  <div class={tw`w-full flex flex-col relative`}>
    <Nav routes={routes} params={params} />
    <Container>
      <div class={tw` min-h-[85vh]`}>{children}</div>
    </Container>
    <Footer />
  </div>
);
