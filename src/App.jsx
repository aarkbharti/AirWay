import { useState, useEffect } from 'react';
import axios from 'axios';
import { Navbar } from './components/Navbar';
import Dashboard from './pages/Dashboard';

export default function App() {
  const [theme, setTheme] = useState("light");
  const [aqiData, setAqiData] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("airaware_theme") || "light";
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("airaware_theme", newTheme);
  };

  const fetchAqiData = async (lat, lon, cityName) => {
    const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

    setLoading(true);
    setError(null);
    try {
      const [currentRes, forecastRes] = await Promise.all([
        axios.get(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`),
        axios.get(`https://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
      ]);
      
      setAqiData({
        current: currentRes.data.list[0],
        hourly: forecastRes.data.list
      });
      setSelectedCity(cityName);
    } catch (err) {
      console.error(err);
      setError("Failed to load air quality data. Please check your API key.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors pt-4">
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main className="max-w-5xl mx-auto px-4 py-6">
        <Dashboard 
          aqiData={aqiData} 
          selectedCity={selectedCity} 
          loading={loading} 
          error={error} 
          onSearch={fetchAqiData} 
        />
      </main>
    </div>
  );
}
