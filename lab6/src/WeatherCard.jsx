function WeatherCard({ date, maxTemp, minTemp, wind, rain, weatherCode }) {
    let description = '';

    if (weatherCode === 0) {
    description = 'Clear sky ☀️';
    } else if (weatherCode >= 1 && weatherCode <= 3) {
    description = 'Cloudy ☁️';
    } else if (weatherCode >= 51 && weatherCode <= 67) {
    description = 'Rainy 🌧️';
    } else if (weatherCode >= 71 && weatherCode <= 77) {
    description = 'Snowy ❄️';
    } else if (weatherCode >= 80 && weatherCode <= 82) {
    description = 'Rain showers 🌦️';
    } else {
    description = 'Other weather 🌤️';
    }
    
    return (
      <div className="weather-card">
        <h3>{date}</h3>
        <h2>{description}</h2>
        <p>Max: {maxTemp} °C</p>
        <p>Min: {minTemp} °C</p>
        <p>Wind: {wind} km/h</p>
        <p>Precipitation: {rain} mm</p>
      </div>
    );
  }
  
  export default WeatherCard;