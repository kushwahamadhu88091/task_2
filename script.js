const apiKey = "18b3692b8ac31b9cfd924ea0f250f602";

const cityInput = document.getElementById("city");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const themeBtn = document.getElementById("theme-btn");

const loader = document.getElementById("loader");
const weather = document.getElementById("weather");
const error = document.getElementById("error");

const cityName = document.getElementById("cityName");
const temp = document.getElementById("temp");
const condition = document.getElementById("condition");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const country = document.getElementById("country");
const icon = document.getElementById("icon");

const forecastContainer = document.getElementById("forecastContainer");

// Search
searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();

    if (city !== "") {
        getWeather(city);
        getForecast(city);
    }
});

// Enter key
cityInput.addEventListener("keypress", e => {
    if (e.key === "Enter") {
        searchBtn.click();
    }
});

// Dark Mode
themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    themeBtn.innerHTML = document.body.classList.contains("dark")
        ? '<i class="fa-solid fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';
});

// Current Location
locationBtn.addEventListener("click", () => {

    if (!navigator.geolocation) {
        alert("Geolocation not supported");
        return;
    }

    navigator.geolocation.getCurrentPosition(async position => {

        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        loader.classList.remove("hidden");

        const url =
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

        const response = await fetch(url);
        const data = await response.json();

        showWeather(data);

        loader.classList.add("hidden");

        getForecastByLocation(lat, lon);

    });
});


// Weather
async function getWeather(city){

    loader.classList.remove("hidden");
    weather.classList.add("hidden");
    error.classList.add("hidden");

    try{

        const response = await fetch(
`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );

        const data = await response.json();

        if(data.cod != 200){
            throw new Error();
        }

        showWeather(data);

    }catch{

        error.classList.remove("hidden");

    }

    loader.classList.add("hidden");

}

// Display Weather
function showWeather(data){

    weather.classList.remove("hidden");

    cityName.innerHTML =
        `${data.name}, ${data.sys.country}`;

    temp.innerHTML =
        `${Math.round(data.main.temp)}°C`;

    condition.innerHTML =
        data.weather[0].main;

    temperature.innerHTML =
        `${data.main.temp} °C`;

    humidity.innerHTML =
        `${data.main.humidity}%`;

    wind.innerHTML =
        `${data.wind.speed} m/s`;

    country.innerHTML =
        data.sys.country;

    icon.src =
`https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;

}

// Forecast
async function getForecast(city){

    forecastContainer.innerHTML="";

    const response = await fetch(
`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
    );

    const data = await response.json();

    const days = data.list.filter(item =>
        item.dt_txt.includes("12:00:00")
    );

    days.forEach(day=>{

        forecastContainer.innerHTML += `

        <div class="forecast-card">

        <h3>${new Date(day.dt_txt).toLocaleDateString()}</h3>

        <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png">

        <p>${Math.round(day.main.temp)}°C</p>

        <p>${day.weather[0].main}</p>

        </div>

        `;

    });

}

// Forecast by Location
async function getForecastByLocation(lat,lon){

    forecastContainer.innerHTML="";

    const response = await fetch(
`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );

    const data = await response.json();

    const days = data.list.filter(item =>
        item.dt_txt.includes("12:00:00")
    );

    days.forEach(day=>{

        forecastContainer.innerHTML += `

        <div class="forecast-card">

        <h3>${new Date(day.dt_txt).toLocaleDateString()}</h3>

        <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png">

        <p>${Math.round(day.main.temp)}°C</p>

        <p>${day.weather[0].main}</p>

        </div>

        `;

    });

}