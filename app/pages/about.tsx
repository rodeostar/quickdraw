import { h, tw } from "quickdraw/client";

const About = () => {
  return (
    <main>
      <h1 class={tw`text-lg font-medium mt-6`}>About</h1>
      <p class={tw`mt-3`}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
        suscipit eu turpis vel ornare. Phasellus placerat varius risus et porta.
        In hac habitasse platea dictumst. Phasellus et iaculis odio. Nullam
        velit orci, consectetur sed nunc quis, aliquam placerat libero.
        Pellentesque scelerisque, dui eu placerat bibendum, neque tellus lacinia
        velit, facilisis viverra dolor libero a velit. Curabitur tristique
        pretium turpis non vestibulum. Suspendisse rutrum non nulla ut
        condimentum. Curabitur imperdiet, massa vitae ultricies ullamcorper, dui
        nisl tristique mauris, ac ultricies ligula ex nec arcu. Cras at est
        maximus, sodales magna dapibus, posuere nulla. Phasellus bibendum
        pharetra iaculis.
      </p>
      <p class={tw`mt-3`}>
        Vestibulum vehicula non nisl eu dignissim. Aliquam interdum, metus sit
        amet porta ultrices, ex justo iaculis nunc, sed malesuada turpis augue
        ut nisi. Mauris gravida condimentum erat vel lacinia. Vestibulum
        hendrerit elit non purus consequat malesuada. Etiam vel risus pulvinar,
        ornare arcu ullamcorper, faucibus mi. Mauris non tincidunt nunc. Sed
        euismod, tortor ut efficitur pharetra, elit orci tincidunt leo, vel
        varius nibh ante quis nisi. Fusce molestie lacus sed varius malesuada.
      </p>
    </main>
  );
};

export const seo = {
  title: "About",
  description: "Blazing fast microframework. All typescript, runs on deno.",
  path: "/about",
  image:
    "https://www.adaptivewfs.com/wp-content/uploads/2020/07/logo-placeholder-image.png",
};

export default About;
