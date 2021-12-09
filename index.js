"use strict";

// IMPORTS

import { platformIcons, generalURL } from "./modules/objects.js";

import useFetch from "./modules/useFetch.js";

import useCard from "./modules/useCard.js";

// DOM ELEMENTS

const burgerButton = document.querySelector("#burgerButton");

const siderbar = document.querySelector("#sidebar");

const gameCardsGrid = document.querySelector("#gameCardsGrid");

const releasePeriodFilter = document.querySelector("#releasePeriodFilter");

const searchGameFilter = document.querySelector("#searchGameFilter");

const filterForm = document.querySelector("#filterForm");

const platformRadios = document.querySelectorAll(".platform-radio");

const prevButton = document.querySelector("#prevButton");

const nextButton = document.querySelector("#nextButton");

// VARIABLES FOR STATE MANAGEMENT

let filter = {
    search: "",
    period: "",
    ordering: "",
    platform: "1",
    prevPage: "",
    currPage: generalURL,
    nextPage: "",
};

// CODE FOR EXECUTION

// BUTTON FOR CLOSING SIDEBAR
burgerButton.addEventListener("click", () => {
    sidebarToggle();
});

// SAVING SEARCH STRING
searchGameFilter.addEventListener("change", (e) => {
    filter.search = e.target.value;
});

// FIRING OFF FETCH ON RELEASE PERIOD CHANGE
releasePeriodFilter.addEventListener("change", (e) => {
    filter.period = e.target.value;
    renderGameCards(getGameCards(urlGenerator()));
});

// FIRING OFF FETCH PREV PAGE ON CLICK
prevButton.addEventListener("click", () => {
    renderGameCards(getGameCards(filter.prevPage));
});

// FIRING OFF FETCH NEXT PAGE ON CLICK
nextButton.addEventListener("click", () => {
    renderGameCards(getGameCards(filter.nextPage));
});

// FIRING OFF FETCH ON PLATFORM CHANGE
platformRadios.forEach((radio) => {
    radio.addEventListener("change", (e) => {
        filter.platform = e.target.id;
        renderGameCards(getGameCards(urlGenerator()));
    });
});

// FIRING OFF FETCH ON SUBMIT
filterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    renderGameCards(getGameCards(urlGenerator()));
});

if (sessionStorage.getItem("lastFilter")) {
    // GETTING FILTER PARAMETERS FROM SESSION STORAGE TO DISPLAY THE SAME DATA IF USER IS RETURNING FROM INNER PAGE
    filter = JSON.parse(sessionStorage.getItem("lastFilter"));
    releasePeriodFilter.value = filter.period;
    searchGameFilter.value = filter.search;
}

// INITIAL DEFAULT FILTER RENDER
renderGameCards(getGameCards(filter.currPage));

// RENDERING PLATFORM SVG ICONS
document.querySelectorAll(".platform-label").forEach((platformLabel) => {
    platformLabel.innerHTML = platformIcons[platformLabel.htmlFor];
});

// SETTING LAST CHOSEN PLATFORM
document.getElementById(`${filter.platform}`).checked = true;

// FUNCTIONS

// FUNCTION FOR GENERATING URL FOR FETCHING BASED ON FILTER PARAMETERS SET BY USER
function urlGenerator() {
    sidebarToggle();

    let string = "";

    if (filter.platform) string += `&parent_platforms=${filter.platform}`;

    if (filter.period) string += `&dates=${filter.period}`;

    if (filter.search) string += `&search=${filter.search}`;

    const filteredURL = generalURL + string;

    return filteredURL;
}

async function getGameCards(url) {
    // HIDING PREV/NEXT BUTTONS
    prevButton.style = "display: none";
    nextButton.style = "display: none";

    // FETCHING ARRAY OF GAMES
    const data = await useFetch(url);

    // RETURNING SELF-INVOKING FUNCTION THAT FIRES OFF AS SOON AS PROMISE FINISHES
    return (() => {
        if (data.results.length === 0)
            // RETURNING NOT FOUND ELEMENT IS CASE THERE ARE NO GAMES
            return `<div class="not-found">
                        <span class="not-found__text">NO GAMES FOUND</span>
                    </div>`;

        // SAVING API PAGE URL FOR OPENING THE SAME PAGE WHEN USER RETURNS BACK FROM INNER PAGES
        filter.currPage = url;

        let cards = "";

        data.results.forEach((game) => {
            cards += useCard(game);
            sessionStorage.setItem(game.slug, JSON.stringify(game));
            // SAVING EACH GAME'S SCREENSHOTS IN SESSION STORAGE FOR LATER ACCESS IN GAME PAGE
        });

        // SAVING FILTER PARAMETERS FOR RENDERING THE SAME DATA WHEN USER RETURNS BACK FROM INNER PAGES
        sessionStorage.setItem("lastFilter", JSON.stringify(filter));

        // SHOWING PREV/NEXT BUTTONS IF THERE MORE GAMES
        if (data.previous) {
            prevButton.style = "display: block";
            filter.prevPage = data.previous;
        }

        if (data.next) {
            nextButton.style = "display: block";
            filter.nextPage = data.next;
        }

        return cards; //
    })(await data);
}

// FUNCTION FOR DYNAMICALLY DISPLAYING CARDS
async function renderGameCards(cards) {
    gameCardsGrid.innerHTML = `
        <div class="loading">
            <div class="loader"></div>
        </div>`;
    gameCardsGrid.innerHTML = await cards;
}

// FUNCTION FOR OPENING AND CLOSING SIDEBAR FOR MOBILE SCREENS
function sidebarToggle() {
    burgerButton.classList.toggle("open");
    siderbar.classList.toggle("open");
}
