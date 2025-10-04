const apiKey = "cbd49bc6ee5d2b6eb33c1b6aa0fc0375";
const city = "Troy";
const country = "US";

const currentURL = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${apiKey}&units=imperial`;
const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city},${country}&appid=${apiKey}&units=imperial`;

// Make an AJAX GET request
function getJSON(url, callback) {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
        const jsonObj = JSON.parse(this.responseText);
        callback(jsonObj);
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}

// Current weather
getJSON(currentURL, function (data) {
    document.getElementById("location").textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById("temperature").textContent = `${Math.round(data.main.temp)}°`;
    document.getElementById("condition").textContent = `${data.weather[0].description} - Feels like ${Math.round(data.main.feels_like)}°`;
    document.getElementById("highlow").textContent = `High: ${Math.round(data.main.temp_max)}° / Low: ${Math.round(data.main.temp_min)}°`;
});

// Forecast
getJSON(forecastURL, function (data) {
    const hourlyTable = document.getElementById("hourly-table");
    const dailyTable = document.getElementById("daily-table");

    // Show next 5 hourly entries
    data.list.slice(0, 5).forEach(item => {
        const date = new Date(item.dt * 1000);
        const time = date.toLocaleTimeString([], { hour: "numeric" });
        const row = `<tr>
        <td>${time}</td>
        <td>${Math.round(item.main.temp)}°</td>
        <td>${(item.pop * 100).toFixed(0)}%</td>
        <td>${item.clouds.all}%</td>
        <td>${Math.round(item.wind.speed)} mph</td>
        </tr>`;
        hourlyTable.innerHTML += row;
    });

    // Group by day for daily high/low
    const daily = {};
    data.list.forEach(item => {
        const day = new Date(item.dt * 1000).toLocaleDateString([], { weekday: "short" });
        if (!daily[day]) {
            daily[day] = { high: -Infinity, low: Infinity };
        }
        daily[day].high = Math.max(daily[day].high, item.main.temp_max);
        daily[day].low = Math.min(daily[day].low, item.main.temp_min);
    });

    // Show first 5 days
    Object.keys(daily).slice(0, 5).forEach(day => {
        const row = `<tr><td>${day}</td><td>${Math.round(daily[day].high)}° / ${Math.round(daily[day].low)}°</td></tr>`;
        dailyTable.innerHTML += row;
    });
});