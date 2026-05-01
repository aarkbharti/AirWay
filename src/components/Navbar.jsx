export function Navbar({ theme, toggleTheme }) {
  return (
    <nav className="w-full bg-transparent py-4 text-gray-900 dark:text-gray-100 relative">
      <div className="max-w-5xl mx-auto px-6 flex justify-between items-center bg-white/50 dark:bg-gray-800/50 backdrop-blur-md shadow-sm rounded-full py-3 border border-gray-100 dark:border-gray-700">
        <div className="flex-1"></div>
        
        <a 
          href="/" 
          className="font-humanist absolute left-1/2 -translate-x-1/2 font-bold text-3xl tracking-tight text-emerald-600 dark:text-emerald-400"
        >
          AirWay
        </a>
        
        <div className="flex flex-1 justify-end items-center gap-6">
          <button 
            onClick={toggleTheme} 
            className="text-sm px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm font-medium"
          >
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </div>
    </nav>
  );
}

