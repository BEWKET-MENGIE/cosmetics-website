// src/components/common/LanguageSelector.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Globe } from 'lucide-react';

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: any;
  }
}

export function LanguageSelector() {
  const [currentLang, setCurrentLang] = useState('en');

  useEffect(() => {
    // Check active translation cookie on mount
    const match = document.cookie.match(/(^|;\s*)googtrans=([^;]*)/);
    if (match) {
      const val = decodeURIComponent(match[2]);
      if (val.includes('/am')) {
        setCurrentLang('am');
      }
    }

    // Load Google Translate script invisibly in the background if not present
    if (!document.getElementById('google-translate-script')) {
      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,am',
            autoDisplay: false,
          },
          'google_translate_hidden'
        );
      };

      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const changeLanguage = (lang: string) => {
    const domain = window.location.hostname;
    if (lang === 'am') {
      document.cookie = `googtrans=/en/am; path=/; domain=${domain}`;
      document.cookie = 'googtrans=/en/am; path=/';
    } else {
      document.cookie = `googtrans=/en/en; path=/; domain=${domain}`;
      document.cookie = 'googtrans=/en/en; path=/';
    }
    setCurrentLang(lang);
    window.location.reload();
  };

  return (
    <div className="relative inline-flex items-center">
      {/* Hidden container required for Google Translate engine */}
      <div id="google_translate_hidden" className="hidden"></div>

      <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-neutral-900 px-3 py-1.5 text-xs font-medium text-neutral-200 transition-colors hover:border-emerald-500/50">
        <Globe size={14} className="text-emerald-400 shrink-0" />
        <select
          value={currentLang}
          onChange={(e) => changeLanguage(e.target.value)}
          aria-label="Select Language"
          className="cursor-pointer bg-transparent text-white focus:outline-none"
        >
          <option value="en" className="bg-neutral-900 text-white">
            English
          </option>
          <option value="am" className="bg-neutral-900 text-white">
            አማርኛ (Amharic)
          </option>
        </select>
      </div>

      {/* Clean up Google's default injected banner frames and tooltips */}
      <style jsx global>{`
        .goog-te-banner-frame {
          display: none !important;
        }
        body {
          top: 0 !important;
        }
        .goog-tooltip {
          display: none !important;
        }
        .goog-te-gadget {
          color: transparent !important;
        }
      `}</style>
    </div>
  );
}