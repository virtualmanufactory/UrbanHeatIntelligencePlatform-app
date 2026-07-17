import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  effect,
  input,
  viewChild,
} from '@angular/core';
import * as L from 'leaflet';
import { HeatMeasurement } from '../heat-measurement';

function temperatureColor(temperature: number, min: number, max: number): string {
  if (max === min) {
    return '#f97316';
  }
  const ratio = (temperature - min) / (max - min);
  const hue = 220 - ratio * 200;
  return `hsl(${hue}, 85%, 50%)`;
}

@Component({
  selector: 'app-heat-map',
  template: '<div class="heat-map" #mapContainer></div>',
  styleUrl: './heat-map.scss',
})
export class HeatMap implements AfterViewInit, OnDestroy {
  readonly measurements = input<HeatMeasurement[]>([]);

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
    this.map = L.map(container, {
      center: [30, 10],
      zoom: 2,
      scrollWheelZoom: true,
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

    if (measurements.length === 0) {
      this.map.setView([30, 10], 2);
      return;
    }

    const temperatures = measurements.map((m) => m.temperature);
    const minTemp = Math.min(...temperatures);
    const maxTemp = Math.max(...temperatures);
    const bounds = L.latLngBounds([]);

    for (const measurement of measurements) {
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
          `${measurement.latitude.toFixed(4)}, ${measurement.longitude.toFixed(4)}`
      );

      marker.addTo(this.layerGroup);
    }

    this.map.fitBounds(bounds, { padding: [40, 40], maxZoom: 8 });
  }
}
