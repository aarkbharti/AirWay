import { SearchBox } from '../components/SearchBox';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function getAqiSeverity(aqi) {
  if (aqi === 1) return { label: 'Good', color: 'text-green-600 dark:text-green-400' };
  if (aqi === 2) return { label: 'Fair', color: 'text-yellow-500 dark:text-yellow-400' };
  if (aqi === 3) return { label: 'Moderate', color: 'text-orange-500 dark:text-orange-400' };
  if (aqi === 4) return { label: 'Poor', color: 'text-red-500 dark:text-red-400' };
  if (aqi === 5) return { label: 'Very Poor', color: 'text-purple-600 dark:text-purple-400' };
  return { label: 'Hazardous', color: 'text-rose-800 dark:text-rose-400' };
}

export default function Dashboard({ aqiData, selectedCity, loading, error, onSearch }) {
  let chartData = [];
  if (aqiData && aqiData.hourly) {
    const hourlyItems = aqiData.hourly.slice(0, 24);
    
    chartData = hourlyItems.map((item) => {
      const dateObj = new Date(item.dt * 1000);
      const timeString = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return {
        time: timeString,
        aqi: item.main.aqi
      };
    });
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-4xl lg:text-5xl font-serif text-gray-900 dark:text-gray-100 mb-4 tracking-tight">Air Quality Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg font-humanist">
          Enter a location to discover its air quality reading.
        </p>
        <div className="max-w-xl mx-auto">
          <SearchBox onSearch={onSearch} />
        </div>
      </div>

      {loading && (
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-8 text-center text-gray-500 shadow-sm border border-gray-100 dark:border-gray-700 rounded-3xl">
          <div className="animate-pulse">Gathering atmospheric data...</div>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 dark:bg-rose-900/10 p-6 text-center text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30 rounded-3xl">
          {error}
        </div>
      )}

      {!loading && !error && aqiData && (
        <div className="animate-fade-in">
          <div className="flex flex-col md:flex-row gap-6 mb-10">
            <div className="md:w-1/3">
              <div className="h-full flex flex-col justify-center border border-gray-100 dark:border-gray-700 p-8 text-center bg-white dark:bg-gray-800 shadow-sm rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-emerald-600 opacity-80" />
                <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white font-humanist">{selectedCity}</h2>
                <div className="mt-2">
                  <p className="text-gray-400 dark:text-gray-500 font-semibold mb-3 tracking-widest text-xs uppercase">Current AQI Index (1-5)</p>
                  <p className={`text-7xl font-extrabold tracking-tighter ${getAqiSeverity(aqiData.current.main.aqi).color}`}>
                    {aqiData.current.main.aqi}
                  </p>
                  <div className={`inline-block mt-4 px-4 py-1 rounded-full text-base font-medium border border-current ${getAqiSeverity(aqiData.current.main.aqi).color} bg-opacity-10`}>
                    {getAqiSeverity(aqiData.current.main.aqi).label}
                  </div>
                </div>
              </div>
            </div>

            <div className="md:w-2/3">
              <div className="h-full border border-gray-100 dark:border-gray-700 p-6 sm:p-8 bg-white dark:bg-gray-800 shadow-sm rounded-3xl">
                <h3 className="text-lg font-bold mb-6 text-gray-800 dark:text-gray-100 font-humanist">24-Hour Timeline</h3>
                <div style={{ height: '260px', width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                      <XAxis dataKey="time" tick={{fontSize: 12, fill: '#9ca3af'}} axisLine={false} tickLine={false} />
                      <YAxis tick={{fontSize: 12, fill: '#9ca3af'}} axisLine={false} tickLine={false} domain={[1, 5]} ticks={[1,2,3,4,5]} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ color: '#059669', fontWeight: 'bold' }}
                      />
                      <Line type="monotone" dataKey="aqi" stroke="#059669" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#059669', strokeWidth: 0 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white font-humanist flex items-center gap-2">
              <span className="w-8 h-[2px] bg-emerald-500 inline-block rounded-full"></span>
              Detailed Pollutants
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
              {[
                { label: 'PM 2.5', name: 'Fine Particles', val: aqiData.current.components.pm2_5 },
                { label: 'PM 10', name: 'Coarse Particles', val: aqiData.current.components.pm10 },
                { label: 'O3', name: 'Ozone', val: aqiData.current.components.o3 },
                { label: 'CO', name: 'Carbon Monoxide', val: aqiData.current.components.co },
                { label: 'NO2', name: 'Nitrogen Dioxide', val: aqiData.current.components.no2 },
                { label: 'SO2', name: 'Sulphur Dioxide', val: aqiData.current.components.so2 },
              ].map((p, idx) => (
                <div key={idx} className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
                  <div className="mb-4">
                    <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{p.label}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">{p.name}</p>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold text-gray-900 dark:text-white">{p.val}</span>
                    <span className="text-xs text-gray-400 font-medium tracking-wide">µg/m³</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
