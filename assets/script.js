const API_KEY = "b3a21d1a0bf55d1cd270ca55053ba8b8";
const currentWeatherURL =
  "https://api.openweathermap.org/data/2.5/weather?units=imperial&";
const fiveDayForecastURL =
  "https://api.openweathermap.org/data/2.5/forecast?units=imperial&";
const previousSearch = [];
const searchButton = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");
const currentCity = document.querySelector(".current-city h2");
const currentCityDate = document.querySelector(".current-city-date");
const currentCityImg = document.querySelector(".current-city-info img");
const temperatureEl = document.querySelector(".temperature .value");
const humidityEl = document.querySelector(".humidity .value");
const windEl = document.querySelector(".wind .value");
const forecastEl = document.querySelectorAll(".forecast-card");

searchButton.addEventListener("click", handleClick);

//==========================================================================================================================//

//Functions//

// function that returns a promise with the latitude and longitude of the whatever city is passed into it
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

// function to retrieve complete data for city inputted in the input form
async function getCityData(city, apiURL) {
  return findLatLon(city).then(async (data) => {
    await data;
    let apiUrl =
      await `${apiURL}lat=${data[0]}&lon=${data[1]}&appid=${API_KEY}`;

    return fetch(apiUrl)
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        return data;
      });
  });
}

// function that retunrs formatted date
function formatDate(date) {
  return dayjs(date).format("MM/DD/YYYY");
}

// function that retrivies data associated with icon code for weather
function getIcon(code) {
  return `https://openweathermap.org/img/w/${code}.png`;
}

// function that handles submit and calls API in the process
function handleClick(e) {
  e.preventDefault();
  if (searchInput.value) {
    getCityData(searchInput.value, currentWeatherURL)
      .then((data) => {
        console.log(data);
        currentCityDate.innerText = dayjs.unix(data.dt).format("MM/DD/YYYY");
        currentCity.innerText =
          data.name.length > 15 ? data.name.slice(0, 15) + "..." : data.name;
        currentCityDate.classList.remove("hide");
        currentCityImg.classList.remove("hide");
        currentCityImg.src = getIcon(data.weather[0].icon);
        temperatureEl.innerText = data.main.temp.toFixed(1);
        windEl.innerText = data.wind.speed.toFixed(1);
        humidityEl.innerText = data.main.humidity;

        return data;
      })
      .then(() => {
        return getCityData(searchInput.value, fiveDayForecastURL);
      })
      .then((data) => {
        searchInput.value = "";
        let fiveDayData = [];
        data.list.forEach((list, index) => {
          if (
            index > 0 &&
            list["dt_txt"].split(" ")[0] !==
              data.list[index - 1]["dt_txt"].split(" ")[0]
          ) {
            fiveDayData.push(list);
          }
        });
        return fiveDayData;
      })
      .then((data) => {
        console.log(data);

        forecastEl.forEach((day, index) => {
          day.querySelector(".forecast-date").innerText = formatDate(
            data[index]["dt_txt"].split(" ")[0]
          );

          day.querySelector(".forecast-temp span").innerText =
            data[index].main.temp.toFixed(1);

          day.querySelector(".forecast-wind span").innerText =
            data[index].wind.speed.toFixed(1);

          day.querySelector(".forecast-humidity span").innerText =
            data[index].main.humidity;

          day.querySelector(".forecast-humidity span").innerText =
            data[index].main.humidity;

          day.querySelector("img").src = getIcon(data[index].weather[0].icon);
        });
      });
  } else return;
}
