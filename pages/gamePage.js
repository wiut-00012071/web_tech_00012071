"use strict";
import TOKEN from "../secret.js";

import { months, displayReleasedDate } from "../modules/objects.js";

import useFetch from "../modules/useFetch.js";

import useComment from "../modules/useComment.js";

const main = document.getElementById("main");

const navigation = document.querySelector("#navigation");

const gameID = window.location.search.substring(1);

const url = `https://api.rawg.io/api/games/${gameID}?key=${TOKEN}`;

const redditUrl = `https://api.rawg.io/api/games/${gameID}/reddit?key=${TOKEN}`;

const screenshots = JSON.parse(
    sessionStorage.getItem(gameID)
).short_screenshots;

function displayMetascore(data) {
    if (!data.metacritic) return "";
    let color = "";
    if (data.metacritic < 70) color = "yellow";
    if (data.metacritic < 40) color = "red";

    return `<h1 class="metascore ${color}">${data.metacritic}</h1>`;
}

function displayRedditDescription(data) {
    if (!data.reddit_description) return "";
    return `<h3>Reddit</h3><p>${data.reddit_description}</p>`;
}

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
            src="${resizedImage}"
            alt=""
        />
        </div>`;
    });
    return screenshots;
}

function displayMetacriticScores(data) {
    if (data.metacritic_platforms.length === 0) return "";
    let scores = "";
    data.metacritic_platforms.forEach((score, i) => {
        if (i !== 0) scores += ", ";
        scores += `<a href="${score.url}"><span>${score.platform.name}</span>-<span>(${score.metascore})</span></a>`;
    });
    return `<div>
                <p class="label">Metacritic scores</p>
                <div>${scores}</div>
            </div>`;
}

function displayLastUpdated(data) {
    if (!data.updated) return "";

    const updated = data.updated.slice(0, 10);

    const [year, month, day] = updated.split("-");

    return `
        <div>
            <p class="label">Last update</p>
            <p>
                ${day} ${months[month - 1]} ${year}
            </p>
        </div>`;
}

function displayList(array) {
    let items = "";
    array.forEach((item, i) => {
        if (i !== 0) items += ", ";
        items += `${item.name}`;
    });
    return items;
}

function displayPlatforms(data) {
    let platforms = "";
    data.platforms.forEach((platform, i) => {
        if (i !== 0) platforms += ", ";
        platforms += `${platform.platform.name}`;
    });
    return platforms;
}

function displayStores(data) {
    let stores = "";
    data.stores.forEach((store) => {
        stores += `<a class="store" href="https://${store.store.domain}">${store.store.name}</a>`;
    });
    return stores;
}

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
    const data = await useFetch(url);
    const redditData = await useFetch(redditUrl);
    (() => {
        document.title = data.name;
        main.innerHTML = `
            <div class="wrapper" style="background-image: url(${
                data.background_image
            });">
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
                                        <div class="text">
                                            <a href="${data.website}">
                                                ${data.name}
                                            </a>
                                        </div>
                                    </div>
                                    <div class="fact">
                                        <p class="label">Released</p>
                                        <div class="text">
                                            ${displayReleasedDate(data)}
                                        </div>
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
