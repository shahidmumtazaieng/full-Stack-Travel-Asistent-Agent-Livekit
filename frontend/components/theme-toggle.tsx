'use client';

import { useEffect, useState } from 'react';
import { Monitor, Moon, Sun } from '@phosphor-icons/react/dist/ssr';
import type { ThemeMode } from '@/lib/types';
import { THEME_MEDIA_QUERY, THEME_STORAGE_KEY, cn } from '@/lib/utils';

const THEME_SCRIPT = `
  const doc = document.documentElement;
  const theme = localStorage.getItem("${THEME_STORAGE_KEY}") ?? "system";

  if (theme === "system") {
    if (window.matchMedia("${THEME_MEDIA_QUERY}").matches) {
      doc.classList.add("dark");
    } else {
      doc.classList.add("light");
    }
  } else {
    doc.classList.add(theme);
  }
  
  // Prevent hydration issues by ensuring the script runs only on the client
  doc.setAttribute('data-theme-loaded', 'true');
`
  .trim()
  .replace(/\n/g, '')
  .replace(/\s+/g, ' ');

function applyTheme(theme: ThemeMode) {
  const doc = document.documentElement;

  doc.classList.remove('dark', 'light');
  localStorage.setItem(THEME_STORAGE_KEY, theme);

  if (theme === 'system') {
    if (window.matchMedia(THEME_MEDIA_QUERY).matches) {
      doc.classList.add('dark');
    } else {
      doc.classList.add('light');
    }
  } else {
    doc.classList.add(theme);
  }
}

interface ThemeToggleProps {
  className?: string;
}

export function ApplyThemeScript() {
  return <script id="theme-script" dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const [theme, setTheme] = useState<ThemeMode | undefined>(undefined);

  useEffect(() => {
    // Check if theme script has already run
    const doc = document.documentElement;
    if (!doc.getAttribute('data-theme-loaded')) {
      // Apply theme if not already loaded
      const storedTheme = (localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode) ?? 'system';
      applyTheme(storedTheme);
    }
    
    const storedTheme = (localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode) ?? 'system';
    setTheme(storedTheme);
  }, []);

  function handleThemeChange(theme: ThemeMode) {
    applyTheme(theme);
    setTheme(theme);
  }

  // Don't render until theme is loaded to prevent hydration mismatch
  if (theme === undefined) {
    return null;
  }

  return (
    <div
      className={cn(
        'bg-white/80 dark:bg-gray-800/80',
        'backdrop-blur-sm',
        'border border-gray-200 dark:border-gray-700',
        'flex w-full flex-row justify-end divide-x divide-gray-200 dark:divide-gray-700 overflow-hidden rounded-full',
        className
      )}
    >
      <span className="sr-only">Color scheme toggle</span>
      <button
        type="button"
        onClick={() => handleThemeChange('dark')}
        className="cursor-pointer p-2 pl-3 flex items-center"
      >
        <span className="sr-only">Enable dark color scheme</span>
        <Moon size={16} weight="bold" className={cn(theme !== 'dark' && 'opacity-25')} />
      </button>
      <button
        type="button"
        onClick={() => handleThemeChange('light')}
        className="cursor-pointer px-3 py-2 flex items-center"
      >
        <span className="sr-only">Enable light color scheme</span>
        <Sun size={16} weight="bold" className={cn(theme !== 'light' && 'opacity-25')} />
      </button>
      <button
        type="button"
        onClick={() => handleThemeChange('system')}
        className="cursor-pointer p-2 pr-3 flex items-center"
      >
        <span className="sr-only">Enable system color scheme</span>
        <Monitor size={16} weight="bold" className={cn(theme !== 'system' && 'opacity-25')} />
      </button>
    </div>
  );
}