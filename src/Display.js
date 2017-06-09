import React from 'react';

import './Display.css';

const ENTER = 13;

const DARKSKY_API_URL = 'https://api.darksky.net/forecast/';
const DARKSKY_API_KEY = 'e1f4da53d6f0d0889607627a1fe13360';
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

const GOOGLE_MAPS_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';
const GOOGLE_MAPS_API_KEY = 'AIzaSyBdpDOpjoue2bvABv9xSdYY6SDdwvtKM30';
var FORMATTED_ADDRESS = '';


// TODO
// Figure out how to use radio buttons and state to switch how temperature is displayed
// Format how the information is displayed
// Maybe add 5 day forecast?

class Display extends React.Component {
  constructor() {
    super();

    this.state = {
      selectedTempUnit: 'c',
      temp: '',
      summary: ''
    };
  }

  _handleUnitChange = (event) => {
    let tempUnit = event.target.value;

    this.setState({
      selectedTempUnit: tempUnit
    });

    // if (tempUnit === 'c') {
    //
    // }
    // else {
    //
    // }
  }

  _handleTyping = (e) => {
    if (this.state && this.state.error) {
      this.setState({ error: null })
    }
    if (e.keyCode===ENTER) {
      this._handleGetWeather()
    }
  }

  _getCoordinatesForCity = (cityName) => {
    let url = `${GOOGLE_MAPS_API_URL}?address=${cityName}&key=${GOOGLE_MAPS_API_KEY}`;

    return (
      fetch(url) // Returns a promise for a Response
      .then(response => response.json()) // Returns a promise for the parsed JSON
      .then(data => {
          FORMATTED_ADDRESS = data.results[0]['formatted_address'];
          return data.results[0].geometry.location;
      }) // Transform the response to only return what we need
    );
  }

  _getCurrentWeather = (coords) => {
    // Template string again! I hope you can see how nicer this is :)
    let url = `${CORS_PROXY}${DARKSKY_API_URL}${DARKSKY_API_KEY}/${coords.lat},${coords.lng}?units=si&exclude=minutely,hourly,daily,alerts,flags`;

    return (
        fetch(url)
        .then(response => response.json())
        .then(data => data.currently)
    );
  }

  _handleGetWeather = () => {
    this._getCoordinatesForCity(this.refs.cityInput.value)
    .then(this._getCurrentWeather)
    .then(weather => {
      console.log(weather)
      this.setState({
        summary: weather.summary,
        temp: weather.temperature
      });
    });
  }

  render() {
    return (
      <main className="display">
        <h1 className="title">Weather App</h1>

        <div className="inputs">
          <input type="text" placeholder="City Name" className="city-input" onKeyUp={this._handleTyping} ref="cityInput"/>
          <button type="submit" className="get-weather-button" onClick={this._handleGetWeather}>Get Weather!</button>
        </div>

        <div className="temperature-units">
          <p><input type="radio" name="degrees" value="c" checked={this.state.selectedTempUnit === 'c'}
            onChange={this._handleUnitChange}
          /> Celsius</p>
          <p><input type="radio" name="degrees" value="f" checked={this.state.selectedTempUnit === 'f'}
            onChange={this._handleUnitChange}
          /> Fahrenheit</p>
        </div>

        <div className="weather-info">
          <p className="weather-for">{FORMATTED_ADDRESS}</p>
          <p className="current-weather">Weather: {this.state.summary}</p>
          <p className="current-temperature">Temperature: {this.state.temp}</p>
        </div>
      </main>
    );
  }
}

export default Display;
