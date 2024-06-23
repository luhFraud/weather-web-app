import { WeatherApi } from "./weather_api";

export class UI {
    static loadPage() {
       UI.displayWeather('los angeles');
       UI.eventListener()
    }

    static async displayWeather(location) {
        const weather = new WeatherApi();
        const loadingScreen = document.getElementById("loading-screen");
        const main = document.querySelector('main')

        try {
            loadingScreen.style.display = 'flex'
            main.style.display = 'none'

            const data= await weather.getData(location);
            this.updateWeather(data);
            this.updateHourlyForecast(data)
            this.updateWeeklyForecast(data);
            // Optionally, you can also process the forecastData here
        } catch (error) {
            console.error("Error fetching weather data:", error);
        } finally {
            loadingScreen.style.display = 'none'
            main.style.display = 'grid'
        }
    }

    static eventListener() {
        UI.search()
        UI.mode()
        UI.temp()
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

    static mode() {
        const toggle = document.getElementById("mode-switch-checkbox");
        const slider = document.getElementById("mode-toggle-slider");
        const main = document.querySelector('main');
        const grids = main.getElementsByClassName("grid-container");

        const loadingScreen = document.getElementById('loading-screen');
    
        slider.addEventListener("click", function() {
            console.log(toggle.checked);
    
            if (!toggle.checked) {
                main.classList.remove("light");
                main.classList.add('dark');

                loadingScreen.classList.remove('light-loading-screen');
                loadingScreen.classList.add('dark-loading-screen')
    
                Array.from(grids).forEach(grid => {
                    grid.classList.remove("light-grid");
                    grid.classList.add('dark-grid');
                });
            } else {
                main.classList.remove("dark");
                main.classList.add('light');

                loadingScreen.classList.add('light-loading-screen');
                loadingScreen.classList.remove('dark-loading-screen')
    
                Array.from(grids).forEach(grid => {
                    grid.classList.remove("dark-grid");
                    grid.classList.add('light-grid');
                });
            }
        });
    }

    static temp() {
        const toggle = document.getElementById("temp-switch-checkbox");
        const slider = document.getElementById("temp-toggle-slider");

        slider.addEventListener('click', function(){
            if(!toggle.checked) {
                let location = document.getElementById("current-weather-header").querySelector('h1').innerHTML;
                UI.displayWeather(location);
            } else {
                let location = document.getElementById("current-weather-header").querySelector('h1').innerHTML;
                UI.displayWeather(location);
            }
        })
    }
    
    static updateWeather(data) {
        if (data && data.location && data.current && data.forecast) {
            const toggle = document.getElementById("temp-switch-checkbox");

            //Main display
            const name = data.location.name
            const country = data.location.country
            const tempF = Math.round(data.current.temp_f);
            const tempC = Math.round(data.current.temp_c);

            //Air Conditions 
            const feelsF = Math.round(data.current.feelslike_f);
            const feelsC = Math.round(data.current.feelslike_c);
            const windMph = Math.round(data.current.wind_mph)
            const windKph = Math.round(data.current.wind_kph);
            const uv = Math.round(data.current.uv);
            const chanceOfRain = Math.round(data.forecast.forecastday[0].day.daily_chance_of_rain);

            //Setting Main display info
            const currentWeatherHeader = document.getElementById("current-weather-header");
            const currentName = currentWeatherHeader.querySelector("h1");
            const currentCountry = currentWeatherHeader.querySelector("p");
            const currentTemp = document.getElementById("current-weather-temp").querySelector("h1");
            
            currentName.innerHTML = name;
            currentCountry.innerHTML = `Country: ${country}`;

            if(toggle.checked) {
                currentTemp.innerHTML = `${tempC}&deg`
            } else {
                currentTemp.innerHTML = `${tempF}&deg`
            }

            //Setting Air Condition info
            const feelsLike = document.querySelector(".feels-like").querySelector("h1");
            const rainChance = document.querySelector(".chance-of-rain").querySelector("h1");
            const windSpeed = document.querySelector(".wind-speed").querySelector("h1");
            const uvIndex = document.querySelector(".uv-index").querySelector("h1");

            if(toggle.checked) {
                feelsLike.innerHTML = `${feelsC}&deg`
                windSpeed.innerHTML = `${windKph} KPH`
            } else {
                feelsLike.innerHTML = `${feelsF}&deg`
                windSpeed.innerHTML = `${windMph} MPH`
            }

            rainChance.innerHTML = `${chanceOfRain}%`
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
    
    static updateHourlyForecast(data){
        if(data && data.location && data.current && data.forecast){
            const toggle = document.getElementById("temp-switch-checkbox");
            
            let hourlyForecast = data.forecast.forecastday[0].hour;
            
            const hourlySlider = document.getElementById("slider-container");
            hourlySlider.innerHTML = '';

            let sunrise = data.forecast.forecastday[0].astro.sunrise;
            let sunset = data.forecast.forecastday[0].astro.sunset;

            hourlyForecast.forEach((hour, index) => {
                const hourLabel = (index === 0) ? '12:00 AM' : 
                                  (index < 12) ? `${index}:00 AM` : 
                                  (index === 12) ? '12:00 PM' : `${index - 12}:00 PM`;
                
                const hourlyWeather = document.createElement('div');
                hourlyWeather.classList.add('hourly-weather');

                const hourlyTime = document.createElement('p');
                hourlyTime.setAttribute("id", 'hourly-time');
                hourlyTime.innerHTML = hourLabel;
                hourlyWeather.appendChild(hourlyTime);

                const hourlyIcon = document.createElement("img");
                hourlyIcon.setAttribute('id', 'hourly-icon');
                let icon = this.getHourlyIcon(hour.condition.code, hourLabel, sunrise, sunset)
                hourlyIcon.src = icon
                hourlyWeather.appendChild(hourlyIcon);

                let tempF = Math.round(hour.temp_f)
                let tempC = Math.round(hour.temp_c)

                const hourlyTemp = document.createElement('h2');
                hourlyTemp.setAttribute('id', "hourly-temp");

                if(toggle.checked) {
                    hourlyTemp.innerHTML = `${tempC}&deg;`
                } else {
                    hourlyTemp.innerHTML = `${tempF}&deg;`
                }

                hourlyWeather.appendChild(hourlyTemp)
                
                hourlySlider.appendChild(hourlyWeather);
            });

        } else {
            console.error("Invalid weather data received:", data);
        }
    }

    static updateWeeklyForecast(data){
        if(data && data.location && data.current && data.forecast){
            const toggle = document.getElementById("temp-switch-checkbox");

            let forecast = data.forecast.forecastday;

            let days = ['Sun', 'Mon', 'Tue', 'Wed','Thu', 'Fri', 'Sat'];
            let todaysIndex = new Date().getDay();
            let dayCounter = todaysIndex;

            const weeklyForcast = document.getElementById("weekly-forecast");
            weeklyForcast.innerHTML = '';

            forecast.forEach((day, index) => {
                const dayName = (index === 0) ? 'Today' : days[dayCounter]
                dayCounter = (dayCounter + 1) % 7;

                const dayForecast = document.createElement('div');
                dayForecast.classList.add("day-forcast");

                const forecastDay = document.createElement('p');
                forecastDay.classList.add('day-forecast-day');
                forecastDay.innerHTML = dayName
                dayForecast.appendChild(forecastDay);

                const forecastIconAndCondition = document.createElement('div');
                forecastIconAndCondition.classList.add("day-forecast-icon-condition");

                const forecastIcon = document.createElement('img');
                forecastIcon.classList.add("weekly-forecast-icon");
                forecastIcon.src = this.getWeeklyIcon(day.day.condition.code);
                forecastIconAndCondition.appendChild(forecastIcon);

                const forecastCondition = document.createElement('p');
                forecastCondition.classList.add("weekly-forecast-condition");
                forecastCondition.innerHTML = this.getCondition(day.day.condition.code)
                forecastIconAndCondition.appendChild(forecastCondition);
                dayForecast.appendChild(forecastIconAndCondition)

                let minF = Math.round(day.day.mintemp_f);
                let maxF = Math.round(day.day.maxtemp_f);
                let minC = Math.round(day.day.mintemp_c);
                let maxC = Math.round(day.day.maxtemp_c);

                const forecastTemps = document.createElement('p');
                forecastTemps.classList.add("max-min-temp")

                if(toggle.checked) {
                    forecastTemps.innerHTML = `${maxC}&deg; / ${minC}&deg;`
                } else {
                    forecastTemps.innerHTML = `${maxF}&deg; / ${minF}&deg;`
                }

                dayForecast.appendChild(forecastTemps);

                weeklyForcast.appendChild(dayForecast);
            }) 
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
                icon = '../src/images/sunny.png'; // Default icon if condition doesn't match
                break;
        }
        return icon;
    }

    static getHourlyIcon(condition, hour, sunrise, sunset) {
        const convertTo24Hour = (time) => {
            const [timePart, modifier] = time.split(' ');
            let [hours, minutes] = timePart.split(':').map(Number);
    
            if (modifier === 'PM' && hours < 12) {
                hours += 12;
            } else if (modifier === 'AM' && hours === 12) {
                hours = 0;
            }
    
            return hours + minutes / 60; // Represent time as hours with fractional minutes
        };
    
        const hour24 = convertTo24Hour(hour);
        const sunrise24 = convertTo24Hour(sunrise);
        const sunset24 = convertTo24Hour(sunset);
    
        // Check if the current hour is before sunrise or after sunset
        const isNight = hour24 < sunrise24 || hour24 >= sunset24;
    
        // Determine the appropriate icon based on the condition and time of day
        let icon;
    
        switch (condition) {
            case 1000: // Sunny / Clear
                icon = isNight ? '../src/images/moon.png' : '../src/images/sunny.png';
                break;
            case 1003: // Partly cloudy
                icon = isNight ? '../src/images/cloudy-moon.png' : '../src/images/cloudy.png';
                break;
            case 1006: // Cloudy
            case 1009: // Overcast
                icon = '../src/images/cloudy.png';
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
            case 1030: // Mist
            case 1135: // Fog
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
                icon = '../src/images/sunny.png'; // Default icon if condition doesn't match
                break;
        }
    
        return icon;
    }

    static getWeeklyIcon(condition) {
        let icon;

        switch (condition) {
            case 1000: // Sunny / Clear
                icon = '../src/images/sunny.png';
                break;
            case 1003: // Partly cloudy
                icon = '../src/images/cloudy.png' 
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
                icon = '../src/images/sunny.png'; // Default icon if condition doesn't match
                break;
        }
        return icon;
    }
    
    static getCondition(condition) {
        let name;

        switch (condition) {
            case 1000: // Sunny / Clear
                name = 'Sunny';
                break;
            case 1003: // Partly cloudy
                name = 'Cloudy' 
                break;
            case 1006: // Cloudy
            case 1009: // Overcast
                name = 'Cloudy'
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
                name = 'Rainy';
                break;
            case 1147: // Freezing fog
            case 1030: //Mist
            case 1135: //Fog
                name = 'Foggy';
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
                name = 'Snowy';
                break;
            case 1087: // Thundery outbreaks possible
            case 1273: // Patchy light rain with thunder
            case 1276: // Moderate or heavy rain with thunder
            case 1279: // Patchy light snow with thunder
            case 1282: // Moderate or heavy snow with thunder
                name = 'Thunder';
                break;
            default:
                name = '../src/images/sunny.png'; // Default icon if condition doesn't match
                break;
        }
        return name;
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
