
export function ThemeToggle({ theme, toggleTheme }) {
  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-full bg-vanilla-panel dark:bg-slate-800 text-vanilla-text dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-vanilla-gold dark:focus:ring-safety-orange"
      aria-label="Toggle Dark Mode"
    >
      <div className="relative w-5 h-5 overflow-hidden">
        {/* Sun Icon */}
        <svg
          className={`absolute inset-0 w-5 h-5 transition-transform duration-500 ${
            theme === 'dark' ? 'translate-y-10 opacity-0' : 'translate-y-0 opacity-100'
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
        {/* Moon Icon */}
        <svg
          className={`absolute inset-0 w-5 h-5 transition-transform duration-500 ${
            theme === 'light' ? '-translate-y-10 opacity-0' : 'translate-y-0 opacity-100'
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      </div>
    </button>
  );
}
