"use strict"; // ENABLING STRICT MODE

// IMPORTING DEPENDENCIES

import TOKEN from "../secret.js";

import { months, displayReleasedDate } from "../modules/objects.js";

import useFetch from "../modules/useFetch.js";

import useComment from "../modules/useComment.js";

// GETTING HTML ELEMENTS

const main = document.getElementById("main");

const navigation = document.querySelector("#navigation");

const imageViewer = document.querySelector("#imageViewer");

const gameID = window.location.search.substring(1);

// DEFAULT URLS

const url = `https://api.rawg.io/api/games/${gameID}?key=${TOKEN}`;

const redditUrl = `https://api.rawg.io/api/games/${gameID}/reddit?key=${TOKEN}`;

// GETTING ARRAY OF SCREENSHOTS FROM SESSION STORAGE THAT WAS SAVED DURING INITIAL FETCHING

const screenshots = JSON.parse(
    sessionStorage.getItem(gameID)
).short_screenshots;

// CONTROLING OPENING AND CLOSING SCREENSHOT VIEWER

document.addEventListener("click", (e) => {
    if (e.target.id === "imageViewerCloseButton") {
        imageViewer.classList.remove("open");
    }
    if (e.target.classList.value === "screenshot__image") {
        viewImage(e.target.src);
    }
});

function resizeBackgroundImage(data) {
    const resizedImage = `${data.background_image.slice(
        0,
        27
    )}/resize/1920/-${data.background_image.slice(27)}`;
    return resizedImage;
}

// FUNCTION FOR DINAMICALLY CHANGING SCREENSHOT TO VIEW
function viewImage(image) {
    imageViewer.innerHTML = `
            <div class="image">
                <img
                    src="${image}"
                    alt=""
                />
            </div>
            <button class="image-viewer__close-button" id="imageViewerCloseButton"></button>`;

    imageViewer.classList.add("open");
}

// CREATING METASCORE ELEMENT, SETTING CLASSNAME COLOR BASED ON SCORE
function displayMetascore(data) {
    if (!data.metacritic) return "";
    let color = "";
    if (data.metacritic < 70) color = "yellow";
    if (data.metacritic < 40) color = "red";

    return `<h1 class="metascore ${color}">${data.metacritic}</h1>`;
}

// CREATING REDDIT DESCRIPTION ELEMNT
function displayRedditDescription(data) {
    if (!data.reddit_description) return "";
    return `<h3>Reddit</h3><p>${data.reddit_description}</p>`;
}

// CREATING GRID OF SCREENSHOTS
function displayScreenshots(data) {
    let screenshots = "";
    data.forEach((shot, i) => {
        if (i == 0) return;

        const resizedImage = `${shot.image.slice(
            0,
            27
        )}/resize/640/-${shot.image.slice(27)}`;

        screenshots += `<div class="screenshot">
                            <img
                                class="screenshot__image"
                                src="${resizedImage}"
                                alt=""
                            />
                        </div>`;
    });
    return screenshots;
}

// CREATING METACRITIC SCORES BY PLATFORM ELEMENT
function displayMetacriticScores(data) {
    if (data.metacritic_platforms.length === 0) return "";
    let scores = "";
    data.metacritic_platforms.forEach((score, i) => {
        if (i !== 0) scores += ", ";
        scores += `<a href="${score.url}"><span>${score.platform.name}</span>-<span>(${score.metascore})</span></a>`;
    });
    return `<div class="fact">
                <p class="label">Metacritic scores</p>
                <p class="text">${scores}</p>
            </div>`;
}

// CREATING LAST UPDATE ELEMENT
function displayLastUpdated(data) {
    if (!data.updated) return "";

    const updated = data.updated.slice(0, 10);

    const [year, month, day] = updated.split("-");

    return `
        <div class="fact">
            <p class="label">Last update</p>
            <p class="text">
                ${day} ${months[month - 1]} ${year}
            </p>
        </div>`;
}

// GENERAL FUNCTION FOR CREATING ELEMENT WITH ARRAY OF ITEMS
function displayList(array) {
    let items = "";
    array.forEach((item, i) => {
        if (i !== 0) items += ", ";
        items += `${item.name}`;
    });
    return items;
}

// CREATING PLATFORMS ELEMENT
function displayPlatforms(data) {
    let platforms = "";
    data.platforms.forEach((platform, i) => {
        if (i !== 0) platforms += ", ";
        platforms += `${platform.platform.name}`;
    });
    return platforms;
}

// CREATING GRID OF STORES ELEMENT
function displayStores(data) {
    let stores = "";
    data.stores.forEach((store) => {
        stores += `<a class="store" href="https://${store.store.domain}">${store.store.name}</a>`;
    });
    return stores;
}

// CREATING GRID OF REDDIT COMMETS
function displayComments(data) {
    if (data.results.length === 0) return "";
    navigation.innerHTML = `
            <a class="logo" href="/">RAWG</a>
            <a href="#description">ABOUT</a>
            <a href="#details">DETAILS</a>
            <a href="#reddit">REDDIT</a>
    `;
    let comments = "";
    data.results.forEach((comment) => {
        comments += useComment(comment);
    });

    return `<section class="reddit" id="reddit">
                <h2>Recent Reddit Comments</h2>
                <div class="comments">
                    ${comments}
                </div>
            </section>`;
}

async function displayGame() {
    // FETCHING GAME DATA AND RELATED REDDIT COMMENTS
    const data = await useFetch(url);
    const redditData = await useFetch(redditUrl);

    // SELF_INVOKING FUNCTION THAT FIRES OFF AS SOON AS BOTH FETCH PORMISES FINISH
    (() => {
        document.title = data.name;
        main.innerHTML = `
            <div class="wrapper" style="background-image: url(${resizeBackgroundImage(
                data
            )});">
                <div class="content">
                    <div class="container">
                        <section class="header">
                            <h1 class="title">${data.name}</h1>
                            ${displayMetascore(data)}
                        </section>
                        <section class="description" id="description">
                            <div class="about">
                                <h2>About</h2>
                               ${data.description}
                               ${displayRedditDescription(data)}
                            </div>
                            <div class="screenshots">
                                ${displayScreenshots(screenshots)}
                            </div>
                        </section>
                        <section class="details" id="details">
                            <h2>Details</h2>
                            <div class="flex">
                                <div class="facts">
                                    <div class="fact">
                                        <p class="label">Official website</p>
                                            <p><a class="text" href="${
                                                data.website
                                            }">
                                                ${data.name}
                                            </a></p>
                                    </div>
                                    <div class="fact">
                                        <p class="label">Released</p>
                                        <p class="text">
                                            ${displayReleasedDate(data)}
                                        </p>
                                    </div>
                                    ${displayLastUpdated(data)}
                                    <div class="fact">
                                        <p class="label">Playtime</p>
                                        <p class="text">
                                            ${data.playtime} hours
                                        </p>
                                    </div>
                                    <div class="fact">
                                        <p class="label">Publishers</p>
                                        <p class="text">
                                            ${displayList(data.publishers)}
                                        </p>
                                    </div>
                                    <div class="fact">
                                        <p class="label">Developers</p>
                                        <p class="text">
                                            ${displayList(data.developers)}
                                        </p>
                                    </div>
                                    <div class="fact">
                                        <p class="label">Platforms</p>
                                        <p class="text">
                                            ${displayPlatforms(data)}
                                        </p>
                                    </div>
                                    ${displayMetacriticScores(data)}
                                    <div class="fact">
                                        <p class="label">Genres</p>
                                        <p class="text">
                                            ${displayList(data.genres)}
                                        </p>
                                    </div>
                                </div>
                                <div class="stores">
                                    ${displayStores(data)}
                                </div>
                            </div>
                        </section>
                        ${displayComments(redditData)}
                    </div>
                </div>
            </div>
            `;
    })(await data, await redditData);
}

displayGame();
