// DOM Element Selection
const searchInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const weatherCard = document.querySelector(".weather-card");
const errorMessage = document.querySelector(".error-message");

// API Keys and URLs
const weatherApiKey = ""; // ⚠️ Don't forget to add your key
const unsplashApiKey = "";    // ⚠️ Don't forget to add your key

const unsplashApiUrl = "https://api.unsplash.com/search/photos?query=";

/**
 * The main function to fetch weather and image data from a given OpenWeatherMap API URL
 * and update the UI accordingly.
 * @param {string} weatherApiUrl - The complete URL to fetch weather data.
 */
async function fetchAndDisplayWeather(weatherApiUrl) {
    try {
        // --- 1. Fetch Weather Data (OpenWeatherMap API) ---
        const weatherResponse = await fetch(weatherApiUrl);

        if (!weatherResponse.ok) {
            // This handles errors like 404 (city not found) or 401 (invalid API key)
            throw new Error(`Weather data not found (Status: ${weatherResponse.status})`);
        }

        const weatherData = await weatherResponse.json();
        const city = weatherData.name; // Extract city name for the image search

        // --- 2. Fetch City Image (Unsplash API) ---
        const imageResponse = await fetch(`${unsplashApiUrl}${city}&client_id=${unsplashApiKey}`);
        const imageData = await imageResponse.json();

        // --- 3. Update UI with Fetched Data ---
        updateWeatherData(weatherData);
        updateBackgroundImage(imageData);

        weatherCard.style.display = "block";
        errorMessage.style.display = "none";

    } catch (error) {
        console.error("Error fetching data:", error);
        errorMessage.textContent = "Could not fetch weather data. Please check the city name or your API key.";
        errorMessage.style.display = "block";
        weatherCard.style.display = "none";
    }
}

/**
 * Updates the DOM with weather information.
 * @param {object} data - The JSON data from OpenWeatherMap.
 */
function updateWeatherData(data) {
    document.querySelector(".city").textContent = data.name;
    document.querySelector(".temp").textContent = Math.round(data.main.temp) + "°C";
    document.querySelector(".humidity").textContent = data.main.humidity + "%";
    document.querySelector(".wind").textContent = data.wind.speed + " km/h";
    document.querySelector(".description").textContent = data.weather[0].description;
    document.querySelector(".weather-icon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
}

/**
 * Updates the page background with an image from Unsplash.
 * @param {object} data - The JSON data from Unsplash.
 */
function updateBackgroundImage(data) {
    if (data.results && data.results.length > 0) {
        const imageUrl = data.results[0].urls.regular;
        document.body.style.backgroundImage = `url('${imageUrl}')`;
    } else {
        // Fallback to a default background if no image is found
        document.body.style.backgroundImage = `url('https://images.unsplash.com/photo-1592210454359-9043f067919b?q=80&w=2070&auto=format&fit=crop')`;
    }
}

/**
 * Initiates a weather search based on a city name.
 * @param {string} city - The name of the city.
 */
function searchByCity(city) {
    const cityApiUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${city}&appid=${weatherApiKey}`;
    fetchAndDisplayWeather(cityApiUrl);
}

/**
 * Handles the initial page load, attempting to use Geolocation first.
 */
function handleInitialLoad() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            // Success callback
            (position) => {
                const { latitude, longitude } = position.coords;
                const coordsApiUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${latitude}&lon=${longitude}&appid=${weatherApiKey}`;
                fetchAndDisplayWeather(coordsApiUrl);
            },
            // Error callback
            () => {
                console.log("Geolocation permission denied or failed. Defaulting to Troy, NY.");
                searchByCity("Troy, NY"); // Default to Troy on error
            }
        );
    } else {
        console.log("Geolocation is not supported by this browser. Defaulting to Troy, NY.");
        searchByCity("Troy, NY"); // Default to Troy if geolocation is not supported
    }
}

// Event Listeners
searchButton.addEventListener("click", () => {
    if (searchInput.value) {
        searchByCity(searchInput.value);
    }
});

searchInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter" && searchInput.value) {
        searchByCity(searchInput.value);
    }
});

// Load weather on page start
window.addEventListener("load", handleInitialLoad);