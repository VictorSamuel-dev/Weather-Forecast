const apiKey = 'd48e73daf0593c92a7af6d1e2c94472a';
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const currentWeather = document.getElementById('current-weather');
const forecast = document.getElementById('forecast');
const searchHistory = document.getElementById('search-history');

// Load search history from local storage
const storedSearchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

// Render search history from local storage
renderSearchHistory();

searchForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const cityName = cityInput.value;
    fetchWeatherData(cityName);
});

function fetchWeatherData(cityName) {
    // Make an API request to OpenWeatherMap
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Process and display current weather data
            displayCurrentWeather(data);
            // Store the city in search history
            addToSearchHistory(cityName);
            // Fetch 5-day forecast
            fetchForecast(cityName);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}

function displayCurrentWeather(data) {
    // Display current weather data in the currentWeather element
    // Extract and format the necessary information from the 'data' object
    currentWeather.innerHTML = `<h2>${data.name}</h2>
                               <p>Date: ${new Date(data.dt * 1000).toLocaleDateString()}</p>
                               <p>Temperature: ${data.main.temp}°C</p>
                               <p>Humidity: ${data.main.humidity}%</p>
                               <p>Wind Speed: ${data.wind.speed} m/s</p>`;
}

function addToSearchHistory(cityName) {
    // Add the city name to the search history
    storedSearchHistory.push(cityName);
    // Store the updated search history in local storage
    localStorage.setItem('searchHistory', JSON.stringify(storedSearchHistory));
    // Render the updated search history
    renderSearchHistory();
}

function renderSearchHistory() {
    // Render search history from local storage
    searchHistory.innerHTML = '';
    for (const cityName of storedSearchHistory) {
        const historyItem = document.createElement('div');
        historyItem.textContent = cityName;
        searchHistory.appendChild(historyItem);
        // Add click event to historyItem to fetch weather for that city
        historyItem.addEventListener('click', function () {
            fetchWeatherData(cityName);
        });
    }
}

function fetchForecast(cityName) {
    // Make an API request to get a 5-day forecast
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            // Process and display the 5-day forecast
            displayForecast(data);
        })
        .catch(error => {
            console.error('Error fetching forecast data:', error);
        });
}

function displayForecast(data) {
    // Display the 5-day forecast data in the forecast element
    // Extract and format the necessary information from the 'data' object
    // Iterate over the 'list' array to get data for each day
    forecast.innerHTML = ''; // Clear previous forecast data
    const forecastItems = []
    forecast.innerHTML += `<h2>5-Day Forecast</h2>`;

    for (let i = 0; i < 5; i++) {
        const forecastItem = data.list[i];
        const dateUnix = forecastItem.dt;
        const fahrenheitTemperature = ((forecastItem.main.temp - 273.15) * 9/5) + 32;
        const date = new Date ((dateUnix + ((i + 1) * 24 * 60 * 60)) * 1000)
        const windSpeedMPH = (forecastItem.wind.speed * 2.24).toFixed(2);

    forecastItems.push(`
        <li class="card">
            <h3>${date.toLocaleDateString()}</h3>
            <h4>Temperature: ${fahrenheitTemperature.toFixed(2)}°F</h4>
            <h4>Wind: ${windSpeedMPH}MPH</h4>
            <h4>Humidity: ${forecastItem.main.humidity}%</h4>
        </li>`)
    }

    forecast.innerHTML += `<ul class="weather-cards">
    ${forecastItems.join(" ")}
    </ul>`
}

const createWeatherCard = (cityName, weatherItem) => {
    if (index == 0) { //HTML for the main weather card
        return ` <div class="details">
                    <h2>${cityName} (${weatherItem.split(" ")[0]})</h2>
                    <h4>Temperature: ${(weatherItem.main.temp)}°F</h4>
                    <h4>Wind: ${weatherItem.wind.speed} MPH</h4>
                    <h4>Humidity: ${weatherItem.main.humidity}%</h4>   
                </div>
                <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}10d@4x.png" alt="weather-icon">
                    <h4>${weatherItem.weather[0].description}</h4>
                </div>`;

    } else { //HTML for the other five day forecast card
        return `<li class="card">
                    <h3>(${weatherItem.split(" ")[0]})</h3>
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}10d@2x.png" alt="weather-icon">
                    <h4>Temperature: ${(weatherItem.main.temp)}°F</h4>
                    <h4>Wind: ${weatherItem.wind.speed} MPH</h4>
                    <h4>Humidity: ${weatherItem.main.humidity}%</h4>    
                </li>`;
    }
}

// Fahrenheit = (Celsius * 9/5) + 32
function displayCurrentWeather(data) {
    // Extract and format the necessary information from the 'data' object
    const cityName = data.name;
    const date = new Date(data.dt * 1000).toLocaleDateString();
    const celsiusTemperature = data.main.temp;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;

    // Convert temperature to Fahrenheit
    const fahrenheitTemperature = ((celsiusTemperature - 273.15) * 9/5) + 32;
    const windSpeedMPH = (windSpeed * 2.24).toFixed(2);
    // Display current weather data in the currentWeather element
    currentWeather.innerHTML = `<h2>${cityName}</h2>
                               <p>Date: ${date}</p>
                               <p>Temperature: ${fahrenheitTemperature.toFixed(2)}°F</p>
                               <p>Humidity: ${humidity}%</p>
                               <p>Wind Speed: ${windSpeedMPH} MPH</p>`;
}
// // Fahrenheit = (Celsius * 9/5) + 32
// function displayForecast(data) {
//     // Extract and format the necessary information from the 'data' object
//     const cityName = data.name;
//     const date = new Date(data.dt * 1000).toLocaleDateString();
//     const celsiusTemperature = data.main.temp;
//     const humidity = data.main.humidity;
//     const windSpeed = data.wind.speed;

//     // Convert temperature to Fahrenheit
//     const fahrenheitTemperature = ((celsiusTemperature - 273.15) * 9/5) + 32;

//     // Display current weather data in the currentWeather element
//     forcast.innerHTML = `<h2>${cityName}</h2>
//                                <p>Date: ${date}</p>
//                                <p>Temperature: ${fahrenheitTemperature.toFixed(2)}°F</p>
//                                <p>Humidity: ${humidity}%</p>
//                                <p>Wind Speed: ${windSpeed} MPH</p>`;
// }