import { platformIcons, months } from "./objects.js";

// FUNCTION FOR CREATING GAME CARDS

export default function useCard(data) {
    let metacriticColor = "green";

    if (data.metacritic < 70) metacriticColor = "yellow";

    if (data.metacritic < 40) metacriticColor = "red";

    let released = "";

    if (data.tba) {
        released = "TBA";
    } else {
        if (data.released !== null) {
            const [year, month, day] = data.released.split("-");

            released = `${day} ${months[month - 1]} ${year}`;
        } else {
            released = "No date";
        }
    }

    let platforms = "";
    data.parent_platforms?.forEach((platform) => {
        const id = `${platform.platform.id}`;
        if (!Object.keys(platformIcons).includes(id)) return;
        platforms += `<div class="game-card__platform">${platformIcons[id]}</div>`;
    });

    return `<div class="game-card">

                ${
                    data.metacritic
                        ? `<div class="game-card__metascore ${metacriticColor}">${data.metacritic}</div>`
                        : ""
                }
                <div class="game-card__image">
                    <img
                        loading="lazy"
                        src="${data.background_image}"
                        alt=""
                    />
                </div>
                <div class="pages/game-card__content">
                    <div class="game-card__platforms">
                        ${platforms}
                    </div>
                    <a href="game-page.html?${data.slug}" >
                        <div class="game-card__title">
                                <h2>
                                    ${data.name}
                                </h2>
                    
                        </div>
                    </a>    
                    <div class="game-card__rating-and-release">
                        <div class="game-card__rating">
                            ${
                                data.esrb_rating?.name
                                    ? data.esrb_rating.name
                                    : ""
                            }
                        </div>
                        <div class="game-card__release">${released}</div>
                    </div>
                </div>
            </div>
    `;
}
