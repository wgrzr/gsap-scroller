import "./style.css";
import "./core.css";
import { createApi } from "unsplash-js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { Draggable } from "gsap/Draggable";

const app = document.querySelector("#app");

app.innerHTML = /*html*/ `
  <div class="app">
    <header>
      <h1 class="title">William Greer</h1>
    </header>
    <div class="posts-container">
      <div class="slider-container">
       <div class="slider">
       </div>
      </div>
    </div>
  </div>
`;

const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS;
const api = createApi({
  accessKey: ACCESS_KEY,
});

const slider = document.querySelector(".slider");
let sliderX = 0;
let sliderWidth = 0;

async function setPhotos() {
  await api.search
    .getPhotos({ query: "minimal aesthetic black dark", page: 2 })
    .then((data) =>
      data.response.results.forEach((result, i) => {
        let imageElement = document.createElement("img");
        let sliderItem = document.createElement("div");
        sliderItem.classList.add("slider-item");
        imageElement.classList.add("slider-img");
        imageElement.setAttribute("alt", `image ${i}`);
        imageElement.src = result.urls.thumb;

        slider.append(sliderItem);
        sliderItem.append(imageElement);
        sliderWidth += sliderItem.offsetWidth;
      })
    )
    .catch(() => {
      console.log("something went wrong!");
    });
  return;
}

await setPhotos();

gsap.registerPlugin(ScrollTrigger);

let sections = gsap.utils.toArray(".slider-img");
let container = document.querySelector(".slider-container");
console.log(container.offsetWidth);

let w = new Array();
for (let i = 0; i < sections.length; i++) {
  w[i] = sections[i].offsetWidth;
}

let realSlideWidth = 0;
for (let i = 0; i < w.length - 1; i++) {
  realSlideWidth += w[i];
}

let tl = gsap
  .timeline({
    scrollTrigger: {
      trigger: "body",
      pin: true,
      scrub: 1,
      markers: true,
    },
  })
  .to(sections, {
    x: () =>
      `-${realSlideWidth + container.offsetWidth - window.innerWidth} + 24`,
  });
