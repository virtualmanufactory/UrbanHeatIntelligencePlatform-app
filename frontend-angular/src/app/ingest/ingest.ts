import { DecimalPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { isInPoland } from '../poland';
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

  protected readonly suggestions = signal<IngestPoint[]>([]);
  protected readonly loadingSuggestions = signal(false);
  protected readonly ingesting = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly validationError = signal<string | null>(null);
  protected readonly result = signal<IngestResponse | null>(null);

  protected localityName = '';
  protected latitude: number | null = null;
  protected longitude: number | null = null;
  protected measurementDate = new Date().toISOString().slice(0, 10);

  ngOnInit(): void {
    this.loadSuggestions();
  }

  protected loadSuggestions(): void {
    this.loadingSuggestions.set(true);
    this.error.set(null);
    this.ingestService.getCities().subscribe({
      next: (data) => {
        this.suggestions.set(data);
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
    this.localityName = locality.name ?? '';
    this.latitude = locality.latitude;
    this.longitude = locality.longitude;
    this.validationError.set(null);
  }

  protected addMeasurement(): void {
    const name = this.localityName.trim();
    if (!name) {
      this.validationError.set('Podaj nazwę miejscowości.');
      return;
    }

    if (this.latitude === null || this.longitude === null) {
      this.validationError.set('Podaj współrzędne geograficzne miejscowości.');
      return;
    }

    if (!isInPoland(this.latitude, this.longitude)) {
      this.validationError.set('Miejscowość musi leżeć na terenie Polski.');
      return;
    }

    this.runIngest([
      {
        name,
        latitude: this.latitude,
        longitude: this.longitude,
      },
    ]);
  }

  protected ingestVoivodeshipCapitals(): void {
    this.error.set(null);
    this.validationError.set(null);
    this.result.set(null);

    this.ingestService.getVoivodeshipCapitals().subscribe({
      next: (capitals) => {
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

  private runIngest(points: IngestPoint[]): void {
    this.validationError.set(null);
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
          this.error.set(
            'Nie udało się dodać pomiaru (POST http://localhost:8000/ingest). ' +
              'Sprawdź, czy backend-python-gis i Kafka są uruchomione.'
          );
          this.ingesting.set(false);
          console.error(err);
        },
      });
  }
}
