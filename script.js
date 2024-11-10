const inputBox = document.getElementById("city");
const button = document.querySelector("button");
const tempText = document.querySelector("#temperature > h2");
const condText = document.querySelector("#condition > h2");
const image = document.querySelector("#weather-icon");
const forecast = document.querySelector("#hourly-forecast");
const weatherSpans = document.querySelectorAll("span");
const apiKey = 'edeef2e990ed12072480cfe2965145a6'

button.addEventListener("click", changeCity);
document.addEventListener('keydown', (event) => {
    if(event.key === "Enter" && inputBox === document.activeElement) {
        changeCity();
    }
});

function changeCity() {
    //stores the city entered in variable
    const city = inputBox.value;
    if(!city) {
        alert("Please enter a city");
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    fetch(currentWeatherUrl)
        .then(response => {
            if(!response.ok) {
                throw new Error("Could not fetch resource");
            }
            return response.json();
        })
        .then(data => {
            //console.log(data);
            updateWeather(data);
        })
        .catch(error => console.error(error));

    fetch(forecastUrl)
        .then(response => {
            if(!response.ok) {
                throw new Error("Could not fetch resource");
            }
            return response.json();
        })
        .then(data => {
            //console.log(data);
            updateForecast(data);
        })
        .catch(error => console.error(error));

    inputBox.focus();
}

function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

function updateWeather(data) {
    tempText.textContent = `${Math.round(data.main.temp - 273.15)}°C`;
    condText.textContent = capitalizeFirstLetter(data.weather[0].description);
    const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`
    image.setAttribute("src", iconUrl);
    image.style.display = "block";
}

function updateForecast(data) {
    let forecastData = data.list;
    //Get weather for next 24 hours in 3 hour intervals
    for(let i = 0; i < 8; i++) {
        weatherSpans[i].innerHTML="";
        //Get data
        const dateTime = new Date(data.list[i].dt * 1000);
        const hours = dateTime.getHours();
        const iconUrl = `https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@4x.png`;
        const temp = `${Math.round(data.list[i].main.temp - 273.15)}°C`;

        //Create elements with data
        const timeBox = document.createElement("p");
        timeBox.textContent = `${hours}:00`;
        const icon = document.createElement("img");
        icon.setAttribute("src", iconUrl);
        const tempBox = document.createElement("p");
        tempBox.textContent = temp;

        weatherSpans[i].appendChild(timeBox);
        weatherSpans[i].appendChild(icon);
        weatherSpans[i].appendChild(tempBox);
        forecast.style.overflowX = "scroll";
    }
}
