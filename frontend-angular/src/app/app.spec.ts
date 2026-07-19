import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';
import { I18nService } from './i18n/i18n.service';

describe('App', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter(routes)],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render navigation links in Polish', () => {
    const i18n = TestBed.inject(I18nService);
    i18n.setLanguage('pl');
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.nav__brand')?.textContent).toContain('Urban Heat');
    expect(compiled.textContent).toContain('Dodaj pomiar dla miejscowości');
    expect(compiled.textContent).toContain('Pomiary');
  });

  it('should switch navigation links to English', () => {
    const i18n = TestBed.inject(I18nService);
    i18n.setLanguage('pl');
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const enButton = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('.lang-switch__btn')
    ).find((button) => button.textContent?.trim() === 'EN') as HTMLButtonElement;
    enButton.click();
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Measurements');
    expect((fixture.nativeElement as HTMLElement).textContent).toContain(
      'Add locality measurement'
    );
  });
});
