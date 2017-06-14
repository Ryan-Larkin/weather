import React from 'react';

import './Display.css';

const ENTER = 13;

// DARKSKY api used for weather information
const DARKSKY_API_URL = 'https://api.darksky.net/forecast/';
const DARKSKY_API_KEY = 'e1f4da53d6f0d0889607627a1fe13360';
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

// google maps api used for coordinate information
const GOOGLE_MAPS_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';
const GOOGLE_MAPS_API_KEY = 'AIzaSyBdpDOpjoue2bvABv9xSdYY6SDdwvtKM30';
var FORMATTED_ADDRESS = '';


// TODO
// Fix the code for the weather-info div. Very inefficient, must be an easier way
// // There is padding on the p tags that looks bad at a small enough screen size. Shouldn't be hardcoded like that
// // Must be a better way of making the tags hidden without having all those ternary ifs

// Maybe add 5 day forecast?
// Add google places autocomplete to input

class Display extends React.Component {
  constructor() {
    super();

    this.state = {
      selectedTempUnit: 'c', // default display in celsius
      temp: '', // temperature of the location
      summary: '' // summary of weather conditions for location
    };
  }

  // Change which unit to display temperature in, celsius or fahrenheit
  _handleUnitChange = (event) => {
    this.setState({
      selectedTempUnit: event.target.value
    });
  }

  // Function to handle input submission without making it a form.
  // On pressing enter, it will simulate a submission
  _handleTyping = (e) => {
    if (this.state && this.state.error) {
      this.setState({ error: null })
    }
    if (e.keyCode===ENTER) {
      this._handleGetWeather();
    }
  }

  // Get coordinates for the city being searched for, to be passed into the next function
  // to get the weather for the retrieved coordinates
  _getCoordinatesForCity = (cityName) => {
    let url = `${GOOGLE_MAPS_API_URL}?address=${cityName}&key=${GOOGLE_MAPS_API_KEY}`;

    return (
      fetch(url)
      .then(response => response.json())
      .then(data => {
          FORMATTED_ADDRESS = data.results[0]['formatted_address'];
          return data.results[0].geometry.location;
      })
    );
  }

  // Takes the coordinates from the google maps API and returns the weather for the area
  _getCurrentWeather = (coords) => {
    let url = `${CORS_PROXY}${DARKSKY_API_URL}${DARKSKY_API_KEY}/${coords.lat},${coords.lng}?units=si&exclude=minutely,hourly,daily,alerts,flags`;

    return (
        fetch(url)
        .then(response => response.json())
        .then(data => data.currently)
    );
  }

  // Function to chain the coordinate and weather retrieval functions and
  // sets the app state with the retrieved values
  _handleGetWeather = () => {
    this._getCoordinatesForCity(this.refs.cityInput.value)
    .then(this._getCurrentWeather)
    .then(weather => {
      this.setState({
        summary: weather.summary,
        temp: Math.round(weather.temperature)
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
          <p className="weather-for">{FORMATTED_ADDRESS ? FORMATTED_ADDRESS : 'Where do you need the weather for?'}</p>
          { this.state.temp
            ? <p className="current-weather">Weather: {this.state.summary}</p>
            : <p className="hidden-input-figure-out-how-to-fix">Weather:</p>
          }
          { this.state.temp
            ? <p className="current-temperature">Temperature: {this.state.selectedTempUnit === 'c' ? this.state.temp : Math.round((this.state.temp * 1.8) + 32)}
                                                            {this.state.temp ? this.state.selectedTempUnit === 'c' ? ' °C' : ' °F' : null}{/*If the temperature exists, then check if it is C or F*/}
            </p>
            : <p className="hidden-input-figure-out-how-to-fix">Temperature:</p>
          }
        </div>
      </main>
    );
  }
}

export default Display;
