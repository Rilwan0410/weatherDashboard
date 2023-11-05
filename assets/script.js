const previousSearch = [];
const searchButton = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");
const city = "Miami";
const API_KEY = "b3a21d1a0bf55d1cd270ca55053ba8b8";
const currentWeatherURL = "https://api.openweathermap.org/data/2.5/weather?";
const fiveDayForecastURL = "https://api.openweathermap.org/data/2.5/forecast?";

async function getData(city, apiURL) {
  // Fetch function to retrieve main data

  findLatLon(city).then(async (data) => {
    await data;
    let apiUrl =
      await `${apiURL}lat=${data[0]}&lon=${data[1]}&appid=${API_KEY}`;

    fetch(apiUrl)
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        console.log(data);
        return data;
      });
  });
}

getData("san francisco", fiveDayForecastURL);

//==========================================================================================================================//

// Helper function that returns a promise with the latitude and longitude of the whatever city is passed into it
async function findLatLon(city) {
  // Fetch function to retrieve latitude and longitude
  return await fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${API_KEY}`
  )
    .then((data) => {
      return data.json();
    })
    .then((data) => {
      return [data[0].lat, data[0].lon];
    });
}
