import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Heat } from './heat';
import { HeatMeasurement } from '../heat-measurement';

describe('Heat', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Heat],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('should create the heat page', () => {
    const fixture = TestBed.createComponent(Heat);
    const httpMock = TestBed.inject(HttpTestingController);
    httpMock.expectOne('http://localhost:8080/api/heat').flush([]);
    httpMock.expectOne((req) => req.url.includes('/api/heat') && req.params.has('date')).flush([]);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should render the heading', () => {
    const fixture = TestBed.createComponent(Heat);
    const httpMock = TestBed.inject(HttpTestingController);
    httpMock.expectOne('http://localhost:8080/api/heat').flush([]);
    httpMock.expectOne((req) => req.url.includes('/api/heat') && req.params.has('date')).flush([]);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Pomiary temperatury w Polsce');
  });

  it('should fetch measurements for the latest available date', () => {
    const fixture = TestBed.createComponent(Heat);
    const httpMock = TestBed.inject(HttpTestingController);
    httpMock.expectOne('http://localhost:8080/api/heat').flush([
      {
        id: 1,
        name: 'Warszawa',
        latitude: 52.2297,
        longitude: 21.0122,
        temperature: 24.5,
        measurementDate: '2026-06-27',
      },
      {
        id: 2,
        name: 'Kraków',
        latitude: 50.0647,
        longitude: 19.945,
        temperature: 26.1,
        measurementDate: '2026-07-01',
      },
    ]);

    const dateRequest = httpMock.expectOne(
      (req) => req.url.includes('/api/heat') && req.params.get('date') === '2026-07-01'
    );
    dateRequest.flush([
      {
        id: 2,
        name: 'Kraków',
        latitude: 50.0647,
        longitude: 19.945,
        temperature: 26.1,
        measurementDate: '2026-07-01',
      },
    ]);
    fixture.detectChanges();

    const component = fixture.componentInstance as unknown as {
      selectedDate: () => string | null;
      polishMeasurements: () => HeatMeasurement[];
    };
    expect(component.selectedDate()).toBe('2026-07-01');
    expect(component.polishMeasurements().length).toBe(1);
    expect(component.polishMeasurements()[0].temperature).toBe(26.1);
  });
});
