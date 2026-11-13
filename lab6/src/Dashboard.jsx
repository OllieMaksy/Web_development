import { useState, useEffect } from 'react';
import WeatherCard from './WeatherCard';

function Dashboard() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const response = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=50.45&longitude=30.52&daily=temperature_2m_max,temperature_2m_min,weather_code,wind_speed_10m_max,precipitation_sum&hourly=relative_humidity_2m,visibility,surface_pressure&timezone=Europe%2FKyiv&forecast_days=5'
        );
  
        if (!response.ok) {
          throw new Error('Failed to fetch weather');
        }
  
        const data = await response.json();
  
        setWeather(data);
        console.log(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  
    fetchWeather();
  }, []);

  let weatherContent = <p>Loading weather...</p>;

    if (!loading) {
      if (weather !== null) {
        weatherContent = (
          <div className="weather-container">
            {weather.daily.time.map((day, index) => (
              <WeatherCard
                key={day}
                date={day}
                maxTemp={weather.daily.temperature_2m_max[index]}
                minTemp={weather.daily.temperature_2m_min[index]}
                wind={weather.daily.wind_speed_10m_max[index]}
                rain={weather.daily.precipitation_sum[index]}
                weatherCode={weather.daily.weather_code[index]}
              />
            ))}
          </div>
        );
      } else {
        weatherContent = <p>Could not load weather.</p>;
      }
    }
    return (
      <div>
        <h1>Weather Dashboard</h1>
        {weatherContent}
      </div>
    );
  }
  
  export default Dashboard;