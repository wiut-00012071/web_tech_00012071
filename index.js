// "use strict";

// // IMPORTS

// import TOKEN from "./secret.js";

// import { platformIcons } from "./modules/objects.js";

// import useFetch from "./modules/useFetch.js";

// import useCard from "./modules/useCard.js";

// // DOM ELEMENTS

// const generalURL = `https://api.rawg.io/api/games?key=${TOKEN}`;

// const burgerButton = document.querySelector("#burgerButton");

// const siderbar = document.querySelector("#sidebar");

// const gameCardsGrid = document.querySelector("#gameCardsGrid");

// const releasePeriodFilter = document.querySelector("#releasePeriodFilter");

// const searchGameFilter = document.querySelector("#searchGameFilter");

// const filterForm = document.querySelector("#filterForm");

// const platformRadios = document.querySelectorAll(".platform-radio");

// const prevButton = document.querySelector("#prevButton");

// const nextButton = document.querySelector("#nextButton");

// // VARIABLES FOR STATE MANAGEMENT

// let filter = {
//     search: "",
//     period: "",
//     ordering: "",
//     platform: "1",
//     prevPage: "",
//     currPage: `https://api.rawg.io/api/games?key=${TOKEN}`,
//     nextPage: "",
// };

// // CODE FOR EXECUTION

// burgerButton.addEventListener("click", () => {
//     sidebarToggle();
// });

// searchGameFilter.addEventListener("change", (e) => {
//     filter.search = e.target.value;
// });

// releasePeriodFilter.addEventListener("change", (e) => {
//     filter.period = e.target.value;
//     renderGameCards(getGameCards(urlGenerator()));
// });

// prevButton.addEventListener("click", () => {
//     renderGameCards(getGameCards(filter.prevPage));
// });

// nextButton.addEventListener("click", () => {
//     renderGameCards(getGameCards(filter.nextPage));
// });

// platformRadios.forEach((radio) => {
//     radio.addEventListener("change", (e) => {
//         filter.platform = e.target.id;
//         renderGameCards(getGameCards(urlGenerator()));
//     });
// });

// filterForm.addEventListener("submit", (e) => {
//     e.preventDefault();
//     renderGameCards(getGameCards(urlGenerator()));
// });

// if (sessionStorage.getItem("lastFilter")) {
//     filter = JSON.parse(sessionStorage.getItem("lastFilter"));
//     releasePeriodFilter.value = filter.period;
//     searchGameFilter.value = filter.search;
// }
// renderGameCards(getGameCards(filter.currPage));

// document.querySelectorAll(".platform-label").forEach((platformLabel) => {
//     platformLabel.innerHTML = platformIcons[platformLabel.htmlFor];
// });

// document.getElementById(`${filter.platform}`).checked = true;

// // FUNCTIONS

// function urlGenerator() {
//     sidebarToggle();

//     let string = "";

//     if (filter.platform) string += `&parent_platforms=${filter.platform}`;

//     if (filter.period) string += `&dates=${filter.period}`;

//     if (filter.search) string += `&search=${filter.search}`;

//     const filteredURL = generalURL + string;

//     return filteredURL;
// }

// async function getGameCards(url) {
//     prevButton.style = "display: none";
//     nextButton.style = "display: none";

//     const data = await useFetch(url);

//     return (() => {
//         filter.currPage = url;

//         let cards = "";

//         if (data.results.length === 0)
//             return `<div class="not-found">
//                 <span class="not-found__text">NO GAMES FOUND</span>
//             </div>`;

//         data.results.forEach((game) => {
//             cards += useCard(game);
//             sessionStorage.setItem(game.slug, JSON.stringify(game));
//         });

//         sessionStorage.setItem("lastFilter", JSON.stringify(filter));

//         if (data.previous) {
//             prevButton.style = "display: block";
//             filter.prevPage = data.previous;
//         }

//         if (data.next) {
//             nextButton.style = "display: block";
//             filter.nextPage = data.next;
//         }

//         return cards;
//     })(await data);
// }

// async function renderGameCards(cards) {
//     gameCardsGrid.innerHTML = ` <div class="loading" id="loading">
//                                     <div class="loader"></div>
//                                 </div>`;

//     gameCardsGrid.innerHTML = await cards;
// }

// function sidebarToggle() {
//     burgerButton.classList.toggle("open");
//     siderbar.classList.toggle("open");
// }
