import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { Ingest } from './ingest';

describe('Ingest', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ingest],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();
  });

  it('should create the ingest page', () => {
    const fixture = TestBed.createComponent(Ingest);
    const httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    httpMock.expectOne('http://localhost:8000/cities').flush([]);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should render the heading', () => {
    const fixture = TestBed.createComponent(Ingest);
    const httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    httpMock.expectOne('http://localhost:8000/cities').flush([]);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Dodaj pomiar miejscowości');
  });

  it('should block coordinates outside Poland', () => {
    const fixture = TestBed.createComponent(Ingest);
    const httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    httpMock.expectOne('http://localhost:8000/cities').flush([]);

    const component = fixture.componentInstance as unknown as {
      localityName: { set: (value: string) => void };
      latitude: { set: (value: number) => void };
      longitude: { set: (value: number) => void };
      onCoordinatesChange: () => void;
      validationError: () => string | null;
      canAddMeasurement: () => boolean;
    };

    component.localityName.set('Berlin');
    component.latitude.set(52.52);
    component.longitude.set(13.405);
    component.onCoordinatesChange();
    fixture.detectChanges();

    expect(component.validationError()).toContain('Polska');
    expect(component.canAddMeasurement()).toBeFalse();
  });

  it('should enable the add button after filling name and Polish coordinates', () => {
    const fixture = TestBed.createComponent(Ingest);
    const httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    httpMock.expectOne('http://localhost:8000/cities').flush([]);

    const component = fixture.componentInstance as unknown as {
      localityName: { set: (value: string) => void };
      latitude: { set: (value: number) => void };
      longitude: { set: (value: number) => void };
      canAddMeasurement: () => boolean;
    };

    // Coordinates first, then name — previously left the button stuck disabled
    // because localityName was a plain field and canAddMeasurement is computed.
    component.latitude.set(52.2297);
    component.longitude.set(21.0122);
    fixture.detectChanges();
    expect(component.canAddMeasurement()).toBeFalse();

    component.localityName.set('Warszawa');
    fixture.detectChanges();

    expect(component.canAddMeasurement()).toBeTrue();
    const button = (fixture.nativeElement as HTMLElement).querySelector(
      'button.btn'
    ) as HTMLButtonElement;
    expect(button.disabled).toBeFalse();
  });
});
