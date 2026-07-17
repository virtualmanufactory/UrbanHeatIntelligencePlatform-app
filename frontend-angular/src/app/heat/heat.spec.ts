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
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should render the heading', () => {
    const fixture = TestBed.createComponent(Heat);
    const httpMock = TestBed.inject(HttpTestingController);
    httpMock.expectOne('http://localhost:8080/api/heat').flush([]);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Pomiary temperatury w Polsce');
  });

  it('should filter measurements by the latest available date', () => {
    const fixture = TestBed.createComponent(Heat);
    const httpMock = TestBed.inject(HttpTestingController);
    httpMock.expectOne('http://localhost:8080/api/heat').flush([
      {
        latitude: 52.2297,
        longitude: 21.0122,
        temperature: 24.5,
        measurementDate: '2026-06-27',
      },
      {
        latitude: 50.0647,
        longitude: 19.945,
        temperature: 26.1,
        measurementDate: '2026-07-01',
      },
    ]);
    fixture.detectChanges();

    const component = fixture.componentInstance as unknown as {
      selectedDate: () => string | null;
      displayedMeasurements: () => HeatMeasurement[];
    };
    expect(component.selectedDate()).toBe('2026-07-01');
    expect(component.displayedMeasurements().length).toBe(1);
    expect(component.displayedMeasurements()[0].temperature).toBe(26.1);
  });
});
