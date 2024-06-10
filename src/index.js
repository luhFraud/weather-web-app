import _ from 'lodash';
import { WeatherApi } from './weather_api';
import './style.css'

const weather = new WeatherApi();

weather.getData('london')
