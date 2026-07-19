import { Injectable, computed, signal } from '@angular/core';
import {
  AppLanguage,
  TRANSLATIONS,
  TranslationDict,
  TranslationKey,
} from './translations';

const STORAGE_KEY = 'uhip.language';

function detectInitialLanguage(): AppLanguage {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'pl' || stored === 'en') {
      return stored;
    }
  } catch {
    // Ignore storage access errors (private mode, SSR, etc.).
  }

  const browserLang = typeof navigator !== 'undefined' ? navigator.language : 'en';
  return browserLang.toLowerCase().startsWith('pl') ? 'pl' : 'en';
}

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly languageSignal = signal<AppLanguage>(detectInitialLanguage());

  readonly language = this.languageSignal.asReadonly();
  readonly dictionary = computed<TranslationDict>(
    () => TRANSLATIONS[this.languageSignal()]
  );

  t(key: TranslationKey, params?: Record<string, string | number>): string {
    let value = TRANSLATIONS[this.languageSignal()][key] ?? key;
    if (params) {
      for (const [param, paramValue] of Object.entries(params)) {
        value = value.replaceAll(`{${param}}`, String(paramValue));
      }
    }
    return value;
  }

  setLanguage(language: AppLanguage): void {
    this.languageSignal.set(language);
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // Ignore storage access errors.
    }
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }

  toggleLanguage(): void {
    this.setLanguage(this.languageSignal() === 'pl' ? 'en' : 'pl');
  }
}
