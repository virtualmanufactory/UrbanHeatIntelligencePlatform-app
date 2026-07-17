import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeatMap } from './heat-map';
import { HeatMeasurement } from '../heat-measurement';

describe('HeatMap', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeatMap],
    }).compileComponents();
  });

  function createMapFixture(): ComponentFixture<HeatMap> {
    const fixture = TestBed.createComponent(HeatMap);
    const container = fixture.nativeElement.querySelector('.heat-map') as HTMLElement;
    // Leaflet needs a sized container to create layers.
    container.style.width = '800px';
    container.style.height = '500px';
    fixture.detectChanges();
    return fixture;
  }

  function markerCount(fixture: ComponentFixture<HeatMap>): number {
    return fixture.nativeElement.querySelectorAll('.leaflet-interactive').length;
  }

  it('should create the map component', () => {
    const fixture = createMapFixture();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should update markers when measurements change', () => {
    const fixture = createMapFixture();

    const warsaw: HeatMeasurement = {
      id: 1,
      name: 'Warszawa',
      latitude: 52.2297,
      longitude: 21.0122,
      temperature: 24.5,
      measurementDate: '2026-07-01',
    };
    const krakow: HeatMeasurement = {
      id: 2,
      name: 'Kraków',
      latitude: 50.0647,
      longitude: 19.945,
      temperature: 26.1,
      measurementDate: '2026-06-27',
    };
    const gdansk: HeatMeasurement = {
      id: 3,
      name: 'Gdańsk',
      latitude: 54.352,
      longitude: 18.6466,
      temperature: 21.2,
      measurementDate: '2026-06-27',
    };

    fixture.componentRef.setInput('measurements', [warsaw]);
    fixture.detectChanges();
    expect(markerCount(fixture)).toBe(1);

    fixture.componentRef.setInput('measurements', [krakow, gdansk]);
    fixture.detectChanges();
    expect(markerCount(fixture)).toBe(2);

    fixture.componentRef.setInput('measurements', []);
    fixture.detectChanges();
    expect(markerCount(fixture)).toBe(0);
  });
});
