import { some } from "./recognition.js";
let API_KEY = "xrXFrwg5tjxbBDqL07dy3ZK5KTQO9siv";

export const fetchLocationName = async (lat, lng) => {
  let loc = await fetch(
    `https://www.mapquestapi.com/geocoding/v1/reverse?key=${API_KEY}&location=${lat},${lng}&includeRoadMetadata=true&includeNearestIntersection=true`
  );
  let resJson = await loc.json();
  return resJson;
};
