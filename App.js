import React, { Component } from 'react';
import { StyleSheet, Text, View, PermissionsAndroid } from 'react-native';
import Weather from './components/Weather';
import { API_KEY } from './utils/WeatherApiKey';

import Geolocation from 'react-native-geolocation-service';

export default class App extends Component {
  state = {
    isLoading: true,
    temperature: 0,
    weatherCondition: null,
    error: null
  };

  componentDidMount = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(
          position => {
            console.log("\n==============================\n Position lat: ", position.coords.latitude)
            console.log("\n Position long: ", position.coords.longitude)
            this.fetchWeather(position.coords.latitude, position.coords.longitude);
          },
          error => {
            this.setState({
              error: 'Error Getting Weather Conditions'
            });
          }
        );
      }
    } catch (err) {
      console.warn(err)
    }
  }

  fetchWeather(lat = 25, lon = 25) {
    fetch(
      `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${API_KEY}&units=metric`
    )
      .then(res => res.json())
      .then(json => {
        console.log("Weather : ", json)
        this.setState({
          temperature: json.main.temp,
          weatherCondition: json.weather[0].main,
          isLoading: false
        });
      });
  }

  render() {
    const { isLoading } = this.state;
    return (
      <View style={styles.container}>
        {isLoading ? (
          <View style={styles.fetchLabelContainer}>
            <Text>Fetching The Weather...</Text>
          </View>
        ) : (
            <Weather
              weather={this.state.weatherCondition}
              temperature={this.state.temperature}
            />
          )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  fetchLabelContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
