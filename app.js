const apiKey = "api key";
const searchButton = document.getElementById("searchButton");
const cityInput = document.getElementById("cityInput");
const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind");
const weatherIcon = document.getElementById("weatherIcon");

var lat, lon;

function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      alert("User denied the request for Geolocation.");
      break;
    case error.POSITION_UNAVAILABLE:
      alert("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      alert("The request to get user location timed out.");
      break;
    case error.UNKNOWN_ERROR:
      alert("An unknown error occurred.");
      break;
  }
}

function showPosition(position) {
  lat = position.coords.latitude;
  lon = position.coords.longitude;
  console.log("Your current position is:");
  console.log("latitue: " + position.coords.latitude);
  console.log("longitude: " + position.coords.longitude);
}

async function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
    console.log("success");
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

function getWeather(url) {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      cityName.textContent = `${data.name}`;
      temperature.textContent = `${Math.round(data.main.temp - 273.15)}°C`;
      description.textContent = `${data.weather[0].main}`;
      humidity.textContent = `Humidity - ${data.main.humidity}%`;
      windSpeed.textContent = `Wind - ${data.wind.speed}m/s`;

      // Set weather icon
      const iconCode = data.weather[0].icon;
      const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;
      weatherIcon.src = iconUrl;
      weatherIcon.alt = `Weather Icon: ${data.weather[0].description}`;
    })
    .catch((error) => console.error(error));
}

function initWeather() {
  getLocation();
  getWeather(
    // `https://api.openweathermap.org/data/2.5/weather?q=London&appid=${apiKey}`
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
  );
}

document.addEventListener("DOMContentLoaded", function () {
  initWeather();
  searchButton.addEventListener("click", function () {
    const city = cityInput.value;
    if (city.length === 0) {
      alert("Please enter a city name");
      return;
    }
    getWeather(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
    );
  });
});
