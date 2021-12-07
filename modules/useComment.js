import { months } from "./objects.js";
export default function useComment(data) {
    const username = data.username.slice(3);
    const title = data.name;
    const text = data.text;

    let image = "";
    if (data.image) {
        image = `<div class="comment__image">
                    <img src=${data.image} alt="" />
                </div>`;
    }

    function displayDate(date) {
        if (date !== null) {
            const created = date.slice(0, 10);
            const [year, month, day] = created.split("-");

            return `${day} ${months[month - 1]} ${year}`;
        } else {
            return "No date";
        }
    }
    return `<div class="comment">
                <div class="comment__user">
                    <h4 class="comment__user-name">${username}</h4>
                </div>
                <div class="comment__content">
                    ${image}
                    <div class="comment__text">
                        <h5>${title}</h5>
                        <p>
                            ${text}
                        </p>
                        <p class="comment__time">${displayDate(
                            data.created
                        )}</p>
                    </div>
                </div>
            </div>
    `;
}
