import { some } from "./recognition.js";
import { cliError } from "./commands.js";
let API_KEY = "xrXFrwg5tjxbBDqL07dy3ZK5KTQO9siv";
let latitude, longitude;
let tempNow = document.querySelector(".temp_now");
let tempFut = document.querySelector(".weather-future");

export const fetchLocationName = async (lat, lng) => {
  try {
    let loc = await fetch(
      `https://www.mapquestapi.com/geocoding/v1/reverse?key=${API_KEY}&location=${lat},${lng}&includeRoadMetadata=true&includeNearestIntersection=true`
    );
    let resJson = await loc.json();
    return resJson;
  } catch (e) {
    cliError("fail to reverse geocode");
  }
};

function weatherData() {
  fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m`
  )
    .then((res) => res.json())
    .then((data) => {
      // console.log(data);
      parseDateWeather(data);
      dailyWeather();
    })
    .catch((e) => {
      // console.log(e);
      cliError("Cannot get the tmperature");
      speakThis("Unable to get weather data");
    });
}
function dailyWeather() {
  try {
    let fetchArr = [
      fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max&timezone=auto`
      ),
      fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_min&timezone=auto`
      ),
    ];
    Promise.all(fetchArr)
      .then((arr) => Promise.all(arr.map((arr) => arr.json())))
      .then((res) => manageDailyData(res));
  } catch (e) {
    cliError("Cannot get the tmperature");
  }
}

dailyWeather();

function geoData() {
  navigator.geolocation.getCurrentPosition(showPosition);
}

async function showPosition(position) {
  try {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    weatherData();
    let location = await fetchLocationName(latitude, longitude);
    let locCnt = document.querySelector(".temp-info> span");
    let locationTxt = `${location.results[0].locations[0].adminArea1} , ${location.results[0].locations[0].adminArea4}`;
    locCnt.textContent = locationTxt;
  } catch (e) {
    cliError("Failed to get the location");
  }
}
function parseDateWeather(data) {
  let date = new Date();
  let year = date.getFullYear();
  let month = (date.getMonth() + 1).toString().padStart(2, 0);
  let hour = date.getHours().toString().padStart(2, 0);
  let MonthDate = date.getDate().toString().padStart(2, 0);
  let tempTime = data.hourly.time;
  let temperature = data.hourly.temperature_2m;
  let index = tempTime.findIndex(function (time) {
    let pattern = new RegExp(`${year}-${month}-${MonthDate}T${hour}:00`);
    return pattern.test(time);
  });
  tempNow.textContent = temperature[index] + "°C";
  return temperature[index];
}
function manageDailyData(obj) {
  // the future temperature data
  let maxArr = obj[0].daily.temperature_2m_max;
  let minArr = obj[1].daily.temperature_2m_min;

  tempFut.innerHTML = maxArr
    .map(function (el, i) {
      return `
        <span>${Math.floor(minArr[i])}-${Math.floor(el)}°C</span>
        `;
    })
    .join("");
}

geoData();
