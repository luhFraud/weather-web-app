
export class WeatherApi {

    constructor() {
        this.key = 'ca56bc537e2e48e49ba53845241006'
        this.url = 'http://api.weatherapi.com/v1'
    }

    async getData(location) {
        const response = await fetch(`${this.url}/current.json?key=${this.key}&q=${location}`);
        const data = await response.json();
        console.log(data)
    }
}