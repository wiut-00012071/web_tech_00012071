export default async function useFetch(url) {
    // General function for fetching API
    const response = await fetch(url, {
        mode: "no-cors", // no-cors, *cors, same-origin
    });
    const data = await response.json();
    return await data;
}
