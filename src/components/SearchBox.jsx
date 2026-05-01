import { useState, useEffect } from 'react';
import axios from 'axios';

export function SearchBox({ onSearch }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
  
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    
    if (!API_KEY) {
      console.warn("Missing OpenWeather API key.");
      return;
    }

    setLoadingSearch(true);
    
    const timeoutId = setTimeout(() => {
      axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`)
        .then((response) => {
          if (response.data) {
            setResults(response.data.map((loc, idx) => ({
              id: idx,
              name: loc.name,
              admin1: loc.state,
              country: loc.country,
              latitude: loc.lat,
              longitude: loc.lon
            })));
          }
          setLoadingSearch(false);
        })
        .catch((error) => {
          console.error("Search error:", error);
          setLoadingSearch(false);
        });
    }, 600);
    
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSelectCity = (city) => {
    const cityName = city.admin1 ? `${city.name}, ${city.admin1}` : city.name;
    onSearch(city.latitude, city.longitude, cityName);
    setQuery("");
    setResults([]);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        className="w-full px-6 py-4 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent text-gray-900 dark:text-gray-100 transition-all text-lg font-humanist placeholder:text-gray-400"
        placeholder="Type a city name..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      
      {loadingSearch && (
        <span className="absolute right-6 top-5 text-sm text-gray-400 animate-pulse">Searching...</span>
      )}

      {results.length > 0 && (
        <ul className="absolute z-10 mt-3 w-full bg-white dark:bg-gray-800 shadow-xl max-h-64 overflow-auto rounded-3xl border border-gray-100 dark:border-gray-700 p-2">
          {results.map((loc) => (
            <li
              key={loc.id}
              className="cursor-pointer py-3 px-4 rounded-2xl hover:bg-emerald-50 dark:hover:bg-gray-700 transition-colors mb-1 last:mb-0 flex flex-col items-start"
              onClick={() => handleSelectCity(loc)}
            >
              <span className="font-bold text-gray-800 dark:text-gray-200 text-lg">{loc.name}</span>
              <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                {loc.admin1 ? `${loc.admin1}, ` : ''}{loc.country}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
