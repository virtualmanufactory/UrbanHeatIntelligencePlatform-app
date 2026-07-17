import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { isInPoland, POLAND_BOUNDS } from '../poland';
import { IngestPoint, IngestResponse } from './ingest.models';
import { IngestService } from './ingest.service';

@Component({
  selector: 'app-ingest',
  imports: [DecimalPipe, FormsModule, RouterLink],
  templateUrl: './ingest.html',
  styleUrl: './ingest.scss',
})
export class Ingest implements OnInit {
  private readonly ingestService = inject(IngestService);

  protected readonly polandBounds = POLAND_BOUNDS;
  protected readonly suggestions = signal<IngestPoint[]>([]);
  protected readonly loadingSuggestions = signal(false);
  protected readonly ingesting = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly validationError = signal<string | null>(null);
  protected readonly result = signal<IngestResponse | null>(null);

  protected readonly localityName = signal('');
  protected readonly latitude = signal<number | null>(null);
  protected readonly longitude = signal<number | null>(null);
  protected measurementDate = new Date().toISOString().slice(0, 10);

  protected readonly hasCoordinates = computed(
    () => this.latitude() !== null && this.longitude() !== null
  );

  protected readonly coordinatesInPoland = computed(() => {
    const latitude = this.latitude();
    const longitude = this.longitude();
    if (latitude === null || longitude === null) {
      return null;
    }
    return isInPoland(latitude, longitude);
  });

  protected readonly canAddMeasurement = computed(
    () =>
      !this.ingesting() &&
      this.localityName().trim().length > 0 &&
      this.hasCoordinates() &&
      this.coordinatesInPoland() === true
  );

  ngOnInit(): void {
    this.loadSuggestions();
  }

  protected loadSuggestions(): void {
    this.loadingSuggestions.set(true);
    this.error.set(null);
    this.ingestService.getCities().subscribe({
      next: (data) => {
        this.suggestions.set(data.filter((locality) => isInPoland(locality.latitude, locality.longitude)));
        this.loadingSuggestions.set(false);
      },
      error: (err) => {
        this.error.set(
          'Nie udało się pobrać przykładowych miejscowości z backendu GIS (http://localhost:8000/cities). ' +
            'Upewnij się, że backend-python-gis jest uruchomiony.'
        );
        this.loadingSuggestions.set(false);
        console.error(err);
      },
    });
  }

  protected useSuggestion(locality: IngestPoint): void {
    this.localityName.set(locality.name);
    this.latitude.set(locality.latitude);
    this.longitude.set(locality.longitude);
    this.validationError.set(null);
  }

  protected onCoordinatesChange(): void {
    const latitude = this.latitude();
    const longitude = this.longitude();
    if (latitude === null || longitude === null) {
      this.validationError.set(null);
      return;
    }

    if (!isInPoland(latitude, longitude)) {
      this.validationError.set(
        `Dozwolone współrzędne: szer. ${POLAND_BOUNDS.minLatitude}–${POLAND_BOUNDS.maxLatitude}, ` +
          `dł. ${POLAND_BOUNDS.minLongitude}–${POLAND_BOUNDS.maxLongitude} (tylko Polska).`
      );
      return;
    }

    this.validationError.set(null);
  }

  protected addMeasurement(): void {
    const name = this.localityName().trim();
    if (!name) {
      this.validationError.set('Podaj nazwę miejscowości.');
      return;
    }

    if (!this.validatePointsInPoland([{ name, latitude: this.latitude()!, longitude: this.longitude()! }])) {
      return;
    }

    this.runIngest([
      {
        name,
        latitude: this.latitude() as number,
        longitude: this.longitude() as number,
      },
    ]);
  }

  protected ingestVoivodeshipCapitals(): void {
    this.error.set(null);
    this.validationError.set(null);
    this.result.set(null);

    this.ingestService.getVoivodeshipCapitals().subscribe({
      next: (capitals) => {
        if (!this.validatePointsInPoland(capitals)) {
          return;
        }
        this.runIngest(capitals);
      },
      error: (err) => {
        this.error.set(
          'Nie udało się pobrać listy miast wojewódzkich (http://localhost:8000/voivodeship-capitals).'
        );
        console.error(err);
      },
    });
  }

  private validatePointsInPoland(points: IngestPoint[]): boolean {
    const outsidePoland = points.find(
      (point) => !isInPoland(point.latitude, point.longitude)
    );

    if (outsidePoland) {
      this.validationError.set(
        `Miejscowość '${outsidePoland.name}' musi leżeć na terenie Polski.`
      );
      return false;
    }

    this.validationError.set(null);
    return true;
  }

  private runIngest(points: IngestPoint[]): void {
    if (!this.validatePointsInPoland(points)) {
      return;
    }

    this.error.set(null);
    this.result.set(null);
    this.ingesting.set(true);

    this.ingestService
      .ingest({
        date: this.measurementDate,
        points,
      })
      .subscribe({
        next: (data) => {
          this.result.set(data);
          this.ingesting.set(false);
        },
        error: (err) => {
          const backendMessage = err?.error?.detail;
          this.error.set(
            typeof backendMessage === 'string'
              ? backendMessage
              : 'Nie udało się dodać pomiaru. Dozwolone są wyłącznie miejscowości w Polsce.'
          );
          this.ingesting.set(false);
          console.error(err);
        },
      });
  }
}
