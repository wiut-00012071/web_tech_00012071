import { platformIcons, displayReleasedDate } from "./objects.js";

// HELPER FUNCTIONS FOR VALIDATING API DATA

// CREATING METASCORE ELEMENT, SETTING CLASSNAME COLOR BASED ON SCORE
function displayMetascore(data) {
    if (!data.metacritic) return "";

    let metacriticColor = "green";

    if (data.metacritic < 70) metacriticColor = "yellow";

    if (data.metacritic < 40) metacriticColor = "red";

    return `<div class="game-card__metascore ${metacriticColor}">${data.metacritic}</div>`;
}

// SERVER-SIDE RESIZING OF IMAGE
function displayResizedImage(data) {
    if (!data.background_image) return "";
    const resizedImage = `
    ${data.background_image.slice(
        0,
        27
    )}/resize/640/-${data.background_image.slice(27)}`;
    return `<img loading="lazy" src="${resizedImage}" alt="" />`;
}

// DISPLAYING ICONS OF PLATFORMS SUPPORTING THE GAME
function displayPlatforms(data) {
    let platforms = "";
    data.parent_platforms?.forEach((platform) => {
        const id = `${platform.platform.id}`;
        if (!Object.keys(platformIcons).includes(id)) return;
        platforms += `<div class="game-card__platform">${platformIcons[id]}</div>`;
    });
    return platforms;
}

// DISPLAYING AGE RATING
function displayAgeRating(data) {
    return data.esrb_rating?.name_en ? data.esrb_rating.name_en : "";
}

// GENERAL FUNCTION FOR CREATING GAME CARDS

export default function useCard(data) {
    return `<div class="game-card">
                ${displayMetascore(data)}
                <div class="game-card__image">
                ${displayResizedImage(data)}
                </div>
                <div class="game-card__content">
                    <div class="game-card__platforms">
                        ${displayPlatforms(data)}
                    </div>
                    <a href="pages/game-page.html?${data.slug}" >
                        <div class="game-card__title">
                                <h2>
                                    ${data.name}
                                </h2>
                        </div>
                    </a>    
                    <div class="game-card__rating-and-release">
                        <div class="game-card__rating">
                            ${displayAgeRating(data)}
                        </div>
                        <div class="game-card__release">
                            ${displayReleasedDate(data)}
                        </div>
                    </div>
                </div>
            </div>
    `;
}
