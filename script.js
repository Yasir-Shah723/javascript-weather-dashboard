const apiKey = "YOUR_API_KEY_HERE"; // Replace with your OpenWeather API key.
const apiBase = "https://api.openweathermap.org/data/2.5/weather";

const searchForm = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const weatherCard = document.getElementById("weather-card");
const loadingState = document.getElementById("loading-state");
const statusText = document.getElementById("status-text");
const dateTimeElement = document.getElementById("date-time");

const cityName = document.getElementById("city-name");
const weatherDesc = document.getElementById("weather-desc");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const condition = document.getElementById("condition");
const feelsLike = document.getElementById("feels-like");
const weatherIcon = document.getElementById("weather-icon");
const footerNote = document.getElementById("footer-note");

const weatherIcons = {
  Thunderstorm: "⛈️",
  Drizzle: "🌦️",
  Rain: "🌧️",
  Snow: "❄️",
  Clear: "☀️",
  Clouds: "☁️",
  Mist: "🌫️",
  Smoke: "🌫️",
  Haze: "🌫️",
  Dust: "🌪️",
  Fog: "🌫️",
  Sand: "🌪️",
  Ash: "🌋",
  Squall: "🌪️",
  Tornado: "🌪️"
};

const themeClasses = {
  Clear: "sunny",
  Clouds: "cloudy",
  Rain: "rainy",
  Drizzle: "rainy",
  Thunderstorm: "rainy",
  Snow: "snowy",
  Mist: "cloudy",
  Smoke: "cloudy",
  Haze: "cloudy",
  Fog: "cloudy",
  Dust: "cloudy",
  Sand: "cloudy",
  Ash: "cloudy",
  Squall: "cloudy",
  Tornado: "cloudy"
};

function displayDateTime() {
  const now = new Date();
  const options = {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  };
  dateTimeElement.textContent = now.toLocaleString("en-US", options);
}

function toggleLoading(show) {
  loadingState.classList.toggle("hidden", !show);
  weatherCard.classList.toggle("hidden", show);
}

function setMessage(message, isError = false) {
  statusText.textContent = message;
  statusText.style.color = isError ? "#ffb3b3" : "#c8d3ff";
}

function updateBackground(conditionKey) {
  const body = document.body;
  Object.values(themeClasses).forEach((theme) => body.classList.remove(theme));
  const theme = themeClasses[conditionKey] || "cloudy";
  body.classList.add(theme);
}

function renderWeather(data) {
  const { name, main, weather } = data;
  const weatherInfo = weather[0];

  cityName.textContent = name;
  weatherDesc.textContent = `${weatherInfo.description}`;
  temperature.textContent = `${Math.round(main.temp)}°C`;
  humidity.textContent = `${main.humidity}%`;
  condition.textContent = weatherInfo.main;
  feelsLike.textContent = `${Math.round(main.feels_like)}°C`;
  weatherIcon.textContent = weatherIcons[weatherInfo.main] || "🌤️";
  footerNote.textContent = `Updated at ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  updateBackground(weatherInfo.main);
}

async function fetchWeather(city) {
  if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
    throw new Error("Please replace YOUR_API_KEY_HERE with your OpenWeather API key in script.js.");
  }

  const url = `${apiBase}?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
  const response = await fetch(url);

  if (!response.ok) {
    const errorData = await response.json();
    const message = errorData.message || "Unable to find weather for that city.";
    throw new Error(message);
  }

  return await response.json();
}

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const city = cityInput.value.trim();

  if (!city) {
    setMessage("Please enter a city name.", true);
    return;
  }

  setMessage("");
  toggleLoading(true);

  try {
    const weatherData = await fetchWeather(city);
    renderWeather(weatherData);
    weatherCard.classList.remove("hidden");
    setMessage(`Showing weather for ${weatherData.name}`);
  } catch (error) {
    setMessage(error.message, true);
  } finally {
    loadingState.classList.add("hidden");
  }
});

window.addEventListener("load", () => {
  displayDateTime();
  setInterval(displayDateTime, 60000);
  setMessage("Search a city to get started.");
});
