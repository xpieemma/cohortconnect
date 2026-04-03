import { useState, useEffect } from 'react';

// Component to toggle a theme class in the body tag on click.
function ThemeToggle() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  
  // Toggles the "dark" class in the body tag when the "theme" state variable updates.
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <button
        aria-label='Toggle Light and Dark Mode'
        title='Toggle Light and Dark Mode'
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="cursor-pointer group p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
    >
        {theme === 'dark' ? (<>🌙 <span className='hidden sm:group-hover:inline'>Dark Mode</span></>) : <>☀️ <span className='hidden sm:group-hover:inline'>Light Mode</span></>}
    </button>
  );
};

export default ThemeToggle;