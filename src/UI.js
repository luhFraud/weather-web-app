import { WeatherApi } from "./weather_api";

export class UI {
    static loadPage() {
        UI.displayWeather('los angeles');
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
            const currentCondition = data.current.condition.text

        } else {
            console.error("Invalid weather data received:", data);
        }
    }

    static getIcon(condition, sunrise, sunset) {
        const currentTime = new Date();
        const currentHour = currentTime.getHours();
        const currentMinutes = currentTime.getMinutes();

        const [sunriseHour, sunriseMinute] = UI.parseTime(sunrise);
        const [sunsetHour, sunsetMinute] = UI.parseTime(sunset);

        let icon;
        switch(condition.toLowerCase()) {
            case 'clear':
            case 'sunny':
                if (currentHour > sunriseHour && (currentHour < sunsetHour || (currentHour === sunsetHour && currentMinutes < sunsetMinute))) {
                    icon = '../src/images/sunny.png';
                } else {
                    icon = '../src/images/moon.png';
                }
                break;
            
        }

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
