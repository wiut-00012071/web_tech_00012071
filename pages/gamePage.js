"use strict";
import TOKEN from "../secret.js";

import { months, displayReleasedDate } from "../modules/objects.js";

import useFetch from "../modules/useFetch.js";

import useComment from "../modules/useComment.js";

const gameContent = document.getElementById("gameContent");

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

    return `<h2 class="metascore ${color}">${data.metacritic}</h2>`;
}

function displayRedditDescription(data) {
    if (!data.reddit_description) return "";
    return `<h3>Reddit</h3>${data.reddit_description}`;
}

function displayScreenshots(data) {
    let screenshots = "";
    data.forEach((shot, i) => {
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

function displayMetacriticScores(data) {
    if (data.metacritic_platforms.length === 0) return "";
    let scores = "";
    data.metacritic_platforms.forEach((score) => {
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

function displayLastUpdated(data) {
    if (!data.updated) return "";

    const updated = data.updated.slice(0, 10);

    const [year, month, day] = updated.split("-");

    return `
        <div>
            <p class="details__label">Last update</p>
            <p>    
                ${day} ${months[month - 1]} ${year}
            </p>
        </div>`;
}

function displayList(array) {
    let items = "";
    array.forEach((item) => {
        items += `<p>${item.name}</p>`;
    });
    return items;
}

function displayPlatforms(data) {
    let platforms = "";
    data.platforms.forEach((platform, i) => {
        if (i === 0) platforms += `${platform.platform.name}`;
        else platforms += `,  ${platform.platform.name}`;
    });
    return platforms;
}

function displayStores(data) {
    let stores = "";
    data.stores.forEach((store) => {
        stores += `<a href="https://${store.store.domain}">${store.store.name}</a>`;
    });
    return stores;
}

function displayComments(data) {
    if (data.results.length === 0) return "";
    let comments = "";
    data.results.forEach((comment) => {
        comments += useComment(comment);
    });

    return `<section id="reddit" class="reddit">
                <h3>Recent Reddit Comments</h3>
                <section class="comments">
                    ${comments}
                </section>
            </section>`;
}

async function displayGame() {
    const data = await useFetch(url);
    const redditData = await useFetch(redditUrl);
    gameContent.innerHTML = "LOADING";
    (() => {
        document.title = data.name;
        gameContent.style.backgroundImage = `url(${data.background_image})`;
        gameContent.innerHTML = `
        <section class="content">
            <div class="container">
                <section class="header">
                    <h1 class="title">${data.name}</h1>
                    ${displayMetascore(data)}
                </section>
                <section id="description" class="about">
                    <article  class="description">
                        <h2>Description</h2>
                        <p>
                        ${data.description}
                        ${displayRedditDescription(data)}
                        </p>
                    </article>
                    <div class="screenshots">
                        ${displayScreenshots(screenshots)}
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
                        ${displayMetacriticScores(data)}
                        ${displayLastUpdated(data)}
                        <div>
                            <p class="details__label">Released</p>
                            <p>${displayReleasedDate(data)}</p>
                        </div>
                        <div>
                            <p class="details__label">Platforms</p>
                            <p>${displayPlatforms(data)}</p>
                        </div>

                    </section>
                    <section class="stores">
                        <h3>Available at</h3>
                        <div>
                            ${displayStores(data)}
                        </div>
                    </section>
                </section>
                ${displayComments(redditData)}
            </div>
        </section>`;
    })(await data, await redditData);
}

displayGame();
