export function nav() {
  const h = document.documentElement;
  const b = document.body;
  const st = "scrollTop";
  const sh = "scrollHeight";
  const progress: HTMLElement | null = document.querySelector("#progress");
  let scroll: number;
  let scrollpos = window.scrollY;
  const header = document.getElementById("header");
  const navcontent = document.getElementById("nav-content");

  document.addEventListener("scroll", function () {
    scroll = ((h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight)) * 100;
    progress?.style.setProperty("--scroll", scroll + "%");
    scrollpos = window.scrollY;

    if (scrollpos > 10) {
      header?.classList.add("bg-white");
      header?.classList.add("shadow");
      navcontent?.classList.remove("bg-gray-100");
      navcontent?.classList.add("bg-white");
    } else {
      header?.classList.remove("bg-white");
      header?.classList.remove("shadow");
      navcontent?.classList.remove("bg-white");
      navcontent?.classList.add("bg-gray-100");
    }
  });

  const toggle = document.getElementById("nav-toggle");

  if (toggle) {
    toggle.onclick = function () {
      document.getElementById("nav-content")?.classList.toggle("hidden");
    };
  }
}
