import { useEffect, useState } from 'react';

export default function usePrefersDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(() =>
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => setIsDarkMode(mediaQuery.matches);

    mediaQuery.addEventListener
      ? mediaQuery.addEventListener('change', handleChange)
      : mediaQuery.addListener(handleChange);

    return () => {
      mediaQuery.removeEventListener
        ? mediaQuery.removeEventListener('change', handleChange)
        : mediaQuery.removeListener(handleChange);
    };
  }, []);

  return isDarkMode;
}
