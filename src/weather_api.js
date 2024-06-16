export class WeatherApi {
    constructor() {
        this.key = 'ca56bc537e2e48e49ba53845241006';
        this.url = 'http://api.weatherapi.com/v1';
    }

    async getCurrent(location) {
        try {
            const response = await fetch(`${this.url}/current.json?key=${this.key}&q=${location}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log(data)
            return data;
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
            throw error;
        }
    }

    async getWeekForecast(location) {
        try {
            const response = await fetch(`${this.url}/forecast.json?key=${this.key}&q=${location}&days=7`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log(data)
            return data;
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
            throw error;
        }
    }
}
