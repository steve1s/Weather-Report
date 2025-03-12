document.addEventListener("DOMContentLoaded", function() {
    fetch("city_coordinates.csv")
        .then(response => response.text())
        .then(data => {
            const lines = data.split("\n").slice(1);
            const citySelect = document.getElementById("city");
            lines.forEach(line => {
                const [latitude, longitude, city, country] = line.split(",");
                if (city && latitude && longitude) {
                    const option = document.createElement("option");
                    option.value = `${latitude.trim()},${longitude.trim()}`;
                    option.textContent = `${city.trim()}, ${country.trim()}`;
                    citySelect.appendChild(option);
                }
            });
        })
        .catch(error => console.error("Error loading cities:", error));
});

async function getWeather() {
    const city = document.getElementById("city").value;
    const [lat, lon] = city.split(",");
    const url = `https://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=civillight&output=json`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        document.getElementById("weather").innerHTML = "Error fetching data.";
    }
}

function displayWeather(data) {
  let output = "<h2>7-Day Forecast</h2>";
    const weatherImages = {
        clear: "../images/clear.png",
        pcloudy: "../images/pcloudy.png",
        mcloudy: "../images/mcloudy.png",
        cloudy: "../images/cloudy.png",
        rain: "../images/rain.png",
        lightrain: "../images/lightrain.png",
        windy: "../images/windy.png",
        snow: "../images/snow.png",
        tstorm: "../images/tstorm.png",
        ishower: "../images/ishower.png",
        tsrain: "../images/tsrain.png",
        oshower: "../images/oshower.png",
        humid: "../images/humid.png",
        fog: "../images/fog.png",
        lightsnow: "../images/lightsnow.png",
    };
    
    data.dataseries.slice(0, 7).forEach(day => {
        const imageUrl = weatherImages[day.weather] || "https://example.com/default.png";
        output += `<div class="weather-day">
            <p>Date: ${day.date}</p>
            <p>Weather: ${day.weather}</p>
            <img src="${imageUrl}" class="weather-icon" alt="${day.weather}">
        </div>`;
    });
    document.getElementById("weather").innerHTML = output;
}