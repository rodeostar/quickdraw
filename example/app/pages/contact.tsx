import { h, tw } from "quickdraw/client";

export default () => (
  <main>
    <h1 class={tw`text-lg font-medium mt-6`}>Contact</h1>
    <p class={tw`mt-3`}>
      Suspendisse accumsan ultrices ante, sit amet ultricies arcu tristique
      quis. Nunc vulputate in orci eget porta. Proin auctor felis ac leo
      hendrerit sollicitudin. Morbi vulputate molestie turpis a aliquet.
      Maecenas tristique vel lacus sed ultricies. Nam eros purus, facilisis at
      diam eu, mattis sollicitudin arcu. Nullam vel posuere eros. In dignissim
      at sapien in placerat. Fusce et lorem a magna sodales egestas et quis
      urna. Praesent posuere metus nec erat ultricies, vel tristique enim
      commodo.
    </p>
    <p class={tw`mt-3`}>
      Aliquam vehicula sapien a ligula elementum, at posuere neque sagittis.
      Suspendisse lacinia, nibh vitae tempus feugiat, ex diam convallis eros,
      quis lacinia nisl orci nec ante. Pellentesque dapibus eu sapien eu
      vehicula. Sed eleifend in ex eget laoreet. Lorem ipsum dolor sit amet,
      consectetur adipiscing elit. Ut quis justo nunc. Nulla pretium nibh at
      rhoncus varius. Aliquam erat volutpat. Maecenas sed lacus pulvinar,
      finibus enim nec, placerat lectus. Donec ante augue, commodo eu eros ut,
      dictum tempor tortor. Mauris porta et libero nec pulvinar. Vivamus sit
      amet ex mattis, consectetur sem eu, malesuada magna. Donec molestie, augue
      sed lobortis feugiat, nulla eros bibendum dui, sed ultrices ligula odio
      vel nibh. Pellentesque faucibus orci laoreet lacus rutrum vulputate.
      Maecenas felis nibh, placerat vel tincidunt et, dictum eu nulla. Etiam
      volutpat sollicitudin nisi, quis euismod est faucibus a.
    </p>
  </main>
);

export const seo = {
  title: "Contact",
  description: "Blazing fast microframework. All typescript, runs on deno.",
  image:
    "https://www.adaptivewfs.com/wp-content/uploads/2020/07/logo-placeholder-image.png",
};
