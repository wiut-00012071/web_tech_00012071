import { months } from "./objects.js";

function displayImage(data) {
    if (!data.image) return "";

    return `<div class="comment__image">
                <img src=${data.image} alt="" />
            </div>`;
}

function displayDate(data) {
    if (!data.created) return "";

    const created = data.created.slice(0, 10);

    const [year, month, day] = created.split("-");

    return `<p class="comment__time">
                ${day} ${months[month - 1]} ${year}
            </p>;`;
}

export default function useComment(data) {
    return `<div class="comment">
                <div class="comment__user">
                    <h4 class="comment__user-name">
                        ${data.username.slice(3)}
                    </h4>
                </div>
                <div class="comment__content">
                    ${displayImage(data)}
                    <div class="comment__text">
                        <h5>${data.name}</h5>
                        <p>${data.text}</p>
                        ${displayDate(data)}
                    </div>
                </div>
            </div>
    `;
}
