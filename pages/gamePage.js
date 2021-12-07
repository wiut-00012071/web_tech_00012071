"use strict";
import TOKEN from "../secret.js";

import { months } from "../modules/objects.js";

import useFetch from "../modules/useFetch.js";

import useComment from "../modules/useComment.js";

const gameContent = document.getElementById("gameContent");

const gameID = window.location.search.substring(1);

const url = `https://api.rawg.io/api/games/${gameID}?key=${TOKEN}`;

const redditUrl = `https://api.rawg.io/api/games/${gameID}/reddit?key=${TOKEN}`;

const screenshotsArray = JSON.parse(
    sessionStorage.getItem(gameID)
).short_screenshots;

function displayReleased(date) {
    if (date !== null) {
        const [year, month, day] = date.split("-");

        return `${day} ${months[month - 1]} ${year}`;
    } else {
        return "No date";
    }
}

function displayLastUpdated(date) {
    if (date !== null) {
        const updated = date.slice(0, 10);
        const [year, month, day] = updated.split("-");

        return `${day} ${months[month - 1]} ${year}`;
    } else {
        return "No date";
    }
}

function displayScreenshots(array) {
    let screenshots = "";
    array.forEach((shot, i) => {
        if (i == 0) return;
        screenshots += `<div class="screenshot">
                <img
                    src="${shot.image}"
                    alt=""
                />
                </div>`;
    });
    return screenshots;
}

function displayList(array) {
    let items = "";
    array.forEach((item) => {
        items += `<p>${item.name}</p>`;
    });
    return items;
}

function displayPlatforms(array) {
    let platforms = "";
    array.forEach((platform, i) => {
        if (i === 0) platforms += `${platform.platform.name}`;
        else platforms += `,  ${platform.platform.name}`;
    });
    return platforms;
}

function displayStores(array) {
    let stores = "";
    array.forEach((store) => {
        stores += `<a href="https://${store.store.domain}">${store.store.name}</a>`;
    });
    return stores;
}

function displayMetacriticScores(array) {
    if (array.length > 0) {
        let scores = "";
        array.forEach((score) => {
            scores += `
            <p>
                <a href="${score.url}">
                <span>${score.metascore}</span>
                <span>${score.platform.name}</span>
                </a>              
            </p>
        `;
        });
        return `<div>
                <p class="details__label">Metacritic scores</p>
                <div>${scores}</div>
            </div>`;
    }

    return "";
}

function displayComments(array) {
    let comments = "";
    if (array.length > 0) {
        array.forEach((comment) => {
            comments += useComment(comment);
        });
        return comments;
    }

    return "";
}

function displayMetascore(data) {
    if (data === null) return "";
    let color = "";
    if (data < 70) color = "yellow";
    if (data < 40) color = "red";
    return `<h2 class="metascore ${color}">${data}</h2>`;
}

async function displayGame() {
    const data = await useFetch(url);
    const redditData = await useFetch(redditUrl);
    gameContent.innerHTML = "LOADING";
    (() => {
        document.title = data.name;
        console.log(data);
        console.log(redditData);
        gameContent.style.backgroundImage = `url(${data.background_image})`;
        gameContent.innerHTML = `<section class="content">
            <div class="container">
                <section class="header">
                    <h1 class="title">${data.name}</h1>
                    ${displayMetascore(data.metacritic)}
                </section>
                <section id="description" class="about">
                    <article  class="description">
                        <h2>Description</h2>
                        <p>
                        ${data.description}
                        ${
                            data.reddit_description
                                ? "<h3>Reddit</h3>" + data.reddit_description
                                : ""
                        }
                        </p>
                    </article>
                    <div class="screenshots">
                        ${displayScreenshots(screenshotsArray)}
                    </div>
                </section>
                <section id="details" class="details-and-shops">
                    <section class="details">
                        <div>
                        <p class="details__label">Official website</p>
                        <a href="${data.website}"><div>${data.name}</div></a>
                        </div>
                        <div>
                            <p class="details__label">Genres</p>
                            <div>${displayList(data.genres)}</div>
                        </div>
                        <div>
                            <p class="details__label">Avarage playtime</p>
                            <div>${data.playtime} hours</div>
                        </div>
                        <div>
                            <p class="details__label">Developers</p>
                            <div>${displayList(data.developers)}</div>
                        </div>
                        <div>
                            <p class="details__label">Publishers</p>
                            <div>${displayList(data.publishers)}</div>
                        </div>
                        ${displayMetacriticScores(data.metacritic_platforms)}
                        <div>
                            <p class="details__label">Released</p>
                            <p>${
                                data.tba
                                    ? "TBA"
                                    : displayReleased(data.released)
                            }</p>
                        </div>
                        <div>
                            <p class="details__label">Last update</p>
                            <p>${displayLastUpdated(data.updated)}</p>
                        </div>
                        <div>
                            <p class="details__label">Platforms</p>
                            <p>${displayPlatforms(data.platforms)}</p>
                        </div>

                    </section>
                    <section class="stores">
                        <h3>Available at</h3>
                        <div>
                            ${displayStores(data.stores)}
                        </div>
                    </section>
                </section>
                ${
                    redditData.results.length > 0
                        ? ` <section id="reddit" class="reddit">
                                <h3>Recent Reddit Comments</h3>
                                <section class="comments">
                                    ${displayComments(redditData.results)}
                                </section>
                            </section>`
                        : ""
                }
                
            </div>
        </section>`;
    })(await data, await redditData);
}

displayGame();
