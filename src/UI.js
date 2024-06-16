import { WeatherApi } from "./weather_api";

export class UI {
    static loadPage() {
        UI.displayWeather('los angeles')
    }

    static displayWeather(location) {
        const weather = new WeatherApi();

        const currentData = weather.getCurrent(location);
        const forecastDate = weather.getWeekForecast(location)

    }

    static updateWeather(data){
        
    }
}
