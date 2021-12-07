export default async function useFetch(url) {
    // General function for fetching API
    const response = await fetch(url);
    const data = await response.json();
    return await data;
}
