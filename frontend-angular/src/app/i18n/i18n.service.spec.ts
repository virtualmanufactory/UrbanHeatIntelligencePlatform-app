import { TestBed } from '@angular/core/testing';
import { I18nService } from './i18n.service';

describe('I18nService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
  });

  it('translates keys for the active language', () => {
    const i18n = TestBed.inject(I18nService);
    i18n.setLanguage('pl');
    expect(i18n.t('nav.measurements')).toBe('Pomiary');
    i18n.setLanguage('en');
    expect(i18n.t('nav.measurements')).toBe('Measurements');
  });

  it('interpolates parameters', () => {
    const i18n = TestBed.inject(I18nService);
    i18n.setLanguage('en');
    expect(
      i18n.t('ingest.errorOutsidePoland', { name: 'Berlin' })
    ).toBe("Locality 'Berlin' must be located in Poland.");
  });

  it('persists the selected language', () => {
    const i18n = TestBed.inject(I18nService);
    i18n.setLanguage('pl');
    expect(localStorage.getItem('uhip.language')).toBe('pl');
    i18n.setLanguage('en');
    expect(localStorage.getItem('uhip.language')).toBe('en');
  });
});
