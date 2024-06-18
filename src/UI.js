import { WeatherApi } from "./weather_api";

export class UI {
    static loadPage() {
       UI.displayWeather('los angeles');
       UI.eventListener()
    }

    static async displayWeather(location) {
        const weather = new WeatherApi();

        try {
            const data= await weather.getData(location);
            this.updateWeather(data);
            // Optionally, you can also process the forecastData here
        } catch (error) {
            console.error("Error fetching weather data:", error);
        }
    }

    static eventListener() {
        UI.search()
    }

    static search() {
        const searchForm = document.getElementById("search-form");
        const searchBtn = document.getElementById("search-btn");

        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchInput = document.getElementById("search-bar");
            const search = searchInput.value;
            UI.displayWeather(search);
            searchInput.value = '';
        })

        searchBtn.addEventListener('click', function(e){
            e.preventDefault();
            const searchInput = document.getElementById("search-bar");
            const search = searchInput.value;
            UI.displayWeather(search);
            searchInput.value = '';
        }) 
    }

    static updateWeather(data) {
        if (data && data.location && data.current && data.forecast) {
            //Main display
            const name = data.location.name;
            const country = data.location.country;
            const tempF = data.current.temp_f;
            const tempC = data.current.temp_c;

            //Air Conditions 
            const feelsF = data.current.feelslike_f
            const feelsC = data.current.feelslike_c
            const windMph = data.current.wind_mph
            const windKph = data.current.wind_kph
            const uv = data.current.uv
            const chanceOfRain = data.forecast.forecastday[0].day.daily_chance_of_rain;

            //Setting Main display info
            const currentWeatherHeader = document.getElementById("current-weather-header");
            const currentName = currentWeatherHeader.querySelector("h1");
            const currentCountry = currentWeatherHeader.querySelector("p");
            const currentTemp = document.getElementById("current-weather-temp").querySelector("h1");
            
            currentName.innerHTML = name;
            currentCountry.innerHTML = `Country: ${country}`;
            currentTemp.innerHTML = `${tempF}&deg`

            //Setting Air Condition info
            const feelsLike = document.querySelector(".feels-like").querySelector("h1");
            const rainChance = document.querySelector(".chance-of-rain").querySelector("h1");
            const windSpeed = document.querySelector(".wind-speed").querySelector("h1");
            const uvIndex = document.querySelector(".uv-index").querySelector("h1");
            feelsLike.innerHTML = `${feelsF}&deg`
            rainChance.innerHTML = `${chanceOfRain}%`
            windSpeed.innerHTML = `${windMph} MPH`
            uvIndex.innerHTML = uv

            //Sunset and Sunrise
            const sunrise = data.forecast.forecastday[0].astro.sunrise;
            const sunset = data.forecast.forecastday[0].astro.sunset

            //Setting icon
            const currentWeatherIcon = document.getElementById("current-weather-icon");
            const currentCondition = data.current.condition.code
            const localtime = data.location.localtime;


            const icon = UI.getIcon(currentCondition, sunrise, sunset, localtime);
            currentWeatherIcon.src = icon;

        } else {
            console.error("Invalid weather data received:", data);
        }
    }

    static getIcon(condition, sunrise, sunset, localtime) {
        const currentHour = new Date(localtime).getHours();
        const currentMinutes = new Date(localtime).getMinutes();

        const [sunriseHour, sunriseMinute] = UI.parseTime(sunrise);
        const [sunsetHour, sunsetMinute] = UI.parseTime(sunset);

        const isDayTime = (currentHour > sunriseHour || (currentHour === sunriseHour && currentMinutes >= sunriseMinute)) &&
                          (currentHour < sunsetHour || (currentHour === sunsetHour && currentMinutes < sunsetMinute));
        let icon;

        switch (condition) {
            case 1000: // Sunny / Clear
                icon = isDayTime ? '../src/images/sunny.png' : '../src/images/moon.png';
                break;
            case 1003: // Partly cloudy
                icon = isDayTime ? '../src/images/cloudy.png' : '../src/images/cloudy-moon.png';
                break;
            case 1006: // Cloudy
            case 1009: // Overcast
                icon = '../src/images/cloudy.png'
                break;
            case 1063: // Patchy rain possible
            case 1150: // Patchy light drizzle
            case 1153: // Light drizzle
            case 1168: // Freezing drizzle
            case 1171: // Heavy freezing drizzle
            case 1180: // Patchy light rain
            case 1183: // Light rain
            case 1186: // Moderate rain at times
            case 1189: // Moderate rain
            case 1192: // Heavy rain at times
            case 1195: // Heavy rain
            case 1198: // Light freezing rain
            case 1201: // Moderate or heavy freezing rain
            case 1240: // Light rain shower
            case 1243: // Moderate or heavy rain shower
            case 1246: // Torrential rain shower
                icon = '../src/images/rainy.png';
                break;
            case 1147: // Freezing fog
            case 1030: //Mist
            case 1135: //Fog
                icon = '../src/images/fog.png';
                break;
            case 1066: // Patchy snow possible
            case 1069: // Patchy sleet possible
            case 1072: // Patchy freezing drizzle possible
            case 1114: // Blowing snow
            case 1117: // Blizzard
            case 1204: // Light sleet
            case 1207: // Moderate or heavy sleet
            case 1210: // Patchy light snow
            case 1213: // Light snow
            case 1216: // Patchy moderate snow
            case 1219: // Moderate snow
            case 1222: // Patchy heavy snow
            case 1225: // Heavy snow
            case 1237: // Ice pellets
            case 1255: // Light snow showers
            case 1258: // Moderate or heavy snow showers
            case 1261: // Light showers of ice pellets
            case 1264: // Moderate or heavy showers of ice pellets
            case 1279: // Patchy light snow with thunder
            case 1282: // Moderate or heavy snow with thunder
                icon = '../src/images/snow.png';
                break;
            case 1087: // Thundery outbreaks possible
            case 1273: // Patchy light rain with thunder
            case 1276: // Moderate or heavy rain with thunder
            case 1279: // Patchy light snow with thunder
            case 1282: // Moderate or heavy snow with thunder
                icon = '../src/images/thunderstorm.png';
                break;
            default:
                icon = '../src/images/default.png'; // Default icon if condition doesn't match
                break;
        }
        return icon;
    }

    static parseTime(timeStr) {
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (modifier === 'PM' && hours !== 12) {
            hours += 12;
        }
        if (modifier === 'AM' && hours === 12) {
            hours = 0;
        }
        return [hours, minutes];
    }
}
