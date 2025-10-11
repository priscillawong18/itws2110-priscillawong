const apiKey = "cbd49bc6ee5d2b6eb33c1b6aa0fc0375";

// GET request
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

// Geolocation API
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
} else {
    alert("Geolocation is not supported by your browser.");
}

function success(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    const currentURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
    const alertsURL = `https://api.weather.gov/alerts/active?point=${lat},${lon}`;

    // Fetch current weather
    getJSON(currentURL, function (data) {
        document.getElementById("location").textContent = `${data.name}, ${data.sys.country}`;
        document.getElementById("temperature").textContent = `${Math.round(data.main.temp)}°`;
        document.getElementById("condition").textContent = `${data.weather[0].main} - Feels like ${Math.round(data.main.feels_like)}°`;
        document.getElementById("highlow").textContent = `High: ${Math.round(data.main.temp_max)}° / Low: ${Math.round(data.main.temp_min)}°`;

        // Change background color based on condition
        const condition = data.weather[0].main.toLowerCase();
        const body = document.body;

        if (condition.includes("rain")) {
            body.style.backgroundColor = "#e6f3ff";
        } else if (condition.includes("clear")) {
            body.style.backgroundColor = "#fffce1";
        } else if (condition.includes("cloud")) {
            body.style.backgroundColor = "#c4c4c4";
        } else {
            body.style.backgroundColor = "#f7f7f7";
        }
    });

    // Fetch forecast
    getJSON(forecastURL, function (data) {
        const hourlyTable = document.getElementById("hourly-table");
        const dailyTable = document.getElementById("daily-table");

        hourlyTable.innerHTML = "";
        dailyTable.innerHTML = "";

        // Next 5 hours
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

        // Daily data
        const daily = {};
        data.list.forEach(item => {
            const day = new Date(item.dt * 1000).toLocaleDateString([], { weekday: "short" });
            if (!daily[day]) {
                daily[day] = { high: -Infinity, low: Infinity };
            }
            daily[day].high = Math.max(daily[day].high, item.main.temp_max);
            daily[day].low = Math.min(daily[day].low, item.main.temp_min);
        });

        // Show first 6 days
        Object.keys(daily).slice(0, 6).forEach(day => {
            const row = `<tr><td>${day}</td><td>${Math.round(daily[day].high)}° / ${Math.round(daily[day].low)}°</td></tr>`;
            dailyTable.innerHTML += row;
        });
    });

    // Fetch alerts
    getJSON(alertsURL, function (data) {
        const alertBox = document.getElementById("alerts-content");
        alertBox.innerHTML = "";

        if (!data.features || data.features.length === 0) {
            alertBox.innerHTML = "<p>No active alerts for this area.</p>";
            return;
        }

        data.features.forEach(alert => {
            const props = alert.properties;
            const alertHTML = `
                <div class="alert">
                    <h4>${props.event}</h4>
                    <p><strong>Status:</strong> ${props.status}</p>
                    <p><strong>Severity:</strong> ${props.severity}</p>
                    <p><strong>Area:</strong> ${props.areaDesc}</p>
                    <p>${props.description || ""}</p>
                </div>
            `;
            alertBox.innerHTML += alertHTML;
        });
    });
}

// Geolocation fails
function error() {
    alert("Unable to retrieve your location. Please enable location access and refresh the page.");
}
