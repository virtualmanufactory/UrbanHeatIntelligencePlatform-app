import { DecimalPipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  computed,
  effect,
  input,
  viewChild,
} from '@angular/core';
import * as L from 'leaflet';
import { HeatMeasurement } from '../heat-measurement';
import {
  getPolandLeafletBounds,
  isInPoland,
  POLAND_MAP_CENTER,
  POLAND_MAP_ZOOM,
} from '../poland';

export function temperatureColor(temperature: number, min: number, max: number): string {
  if (max === min) {
    return '#f97316';
  }
  const ratio = (temperature - min) / (max - min);
  const hue = 220 - ratio * 200;
  return `hsl(${hue}, 85%, 50%)`;
}

export function temperatureLegendGradient(min: number, max: number): string {
  if (max === min) {
    const color = temperatureColor(min, min, max);
    return `linear-gradient(to right, ${color}, ${color})`;
  }
  return `linear-gradient(to right, ${temperatureColor(min, min, max)}, ${temperatureColor(max, min, max)})`;
}

@Component({
  selector: 'app-heat-map',
  imports: [DecimalPipe],
  templateUrl: './heat-map.html',
  styleUrl: './heat-map.scss',
})
export class HeatMap implements AfterViewInit, OnDestroy {
  readonly measurements = input<HeatMeasurement[]>([]);

  protected readonly minTemp = computed(() => {
    const temps = this.measurements().map((m) => m.temperature);
    return temps.length > 0 ? Math.min(...temps) : null;
  });

  protected readonly maxTemp = computed(() => {
    const temps = this.measurements().map((m) => m.temperature);
    return temps.length > 0 ? Math.max(...temps) : null;
  });

  protected readonly hasLegend = computed(
    () => this.minTemp() !== null && this.maxTemp() !== null
  );

  protected readonly legendGradient = computed(() => {
    const min = this.minTemp();
    const max = this.maxTemp();
    if (min === null || max === null) {
      return '';
    }
    return temperatureLegendGradient(min, max);
  });

  private readonly mapContainer = viewChild.required<ElementRef<HTMLDivElement>>('mapContainer');
  private map?: L.Map;
  private layerGroup?: L.LayerGroup;
  private viewReady = false;

  constructor() {
    effect(() => {
      if (!this.viewReady) {
        return;
      }
      this.renderMarkers(this.measurements());
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.viewReady = true;
    this.renderMarkers(this.measurements());
  }

  ngOnDestroy(): void {
    this.map?.remove();
    this.map = undefined;
  }

  private initMap(): void {
    const container = this.mapContainer().nativeElement;
    const polandBounds = L.latLngBounds(getPolandLeafletBounds());
    this.map = L.map(container, {
      center: POLAND_MAP_CENTER,
      zoom: POLAND_MAP_ZOOM,
      scrollWheelZoom: true,
      maxBounds: polandBounds,
      maxBoundsViscosity: 1.0,
      minZoom: 5,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(this.map);

    this.layerGroup = L.layerGroup().addTo(this.map);
  }

  private renderMarkers(measurements: HeatMeasurement[]): void {
    if (!this.map || !this.layerGroup) {
      return;
    }

    this.layerGroup.clearLayers();

    const polishMeasurements = measurements.filter((measurement) =>
      isInPoland(measurement.latitude, measurement.longitude)
    );

    if (polishMeasurements.length === 0) {
      this.map.setView(POLAND_MAP_CENTER, POLAND_MAP_ZOOM);
      return;
    }

    const temperatures = polishMeasurements.map((m) => m.temperature);
    const minTemp = Math.min(...temperatures);
    const maxTemp = Math.max(...temperatures);
    const bounds = L.latLngBounds([]);

    for (const measurement of polishMeasurements) {
      const position: L.LatLngExpression = [measurement.latitude, measurement.longitude];
      bounds.extend(position);

      const marker = L.circleMarker(position, {
        radius: 10,
        color: '#0f172a',
        weight: 2,
        fillColor: temperatureColor(measurement.temperature, minTemp, maxTemp),
        fillOpacity: 0.9,
      });

      marker.bindPopup(
        `<strong>${measurement.temperature.toFixed(1)} °C</strong><br>` +
          `${measurement.latitude.toFixed(4)}, ${measurement.longitude.toFixed(4)}` +
          (measurement.measurementDate ? `<br>${measurement.measurementDate}` : '')
      );

      marker.addTo(this.layerGroup);
    }

    this.map.fitBounds(bounds, { padding: [40, 40], maxZoom: 8 });
  }
}
