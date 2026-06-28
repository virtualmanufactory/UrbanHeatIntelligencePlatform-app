import { DecimalPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
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

  protected readonly cities = signal<IngestPoint[]>([]);
  protected readonly loadingCities = signal(false);
  protected readonly ingesting = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly result = signal<IngestResponse | null>(null);
  protected measurementDate = new Date().toISOString().slice(0, 10);

  ngOnInit(): void {
    this.loadCities();
  }

  protected loadCities(): void {
    this.loadingCities.set(true);
    this.error.set(null);
    this.ingestService.getCities().subscribe({
      next: (data) => {
        this.cities.set(data);
        this.loadingCities.set(false);
      },
      error: (err) => {
        this.error.set(
          'Nie udało się pobrać listy miast z backendu GIS (http://localhost:8000/cities). ' +
            'Upewnij się, że backend-python-gis jest uruchomiony.'
        );
        this.loadingCities.set(false);
        console.error(err);
      },
    });
  }

  protected runIngest(): void {
    this.ingesting.set(true);
    this.error.set(null);
    this.result.set(null);
    this.ingestService.ingest({ date: this.measurementDate }).subscribe({
      next: (data) => {
        this.result.set(data);
        this.ingesting.set(false);
      },
      error: (err) => {
        this.error.set(
          'Ingest nie powiódł się (POST http://localhost:8000/ingest). ' +
            'Sprawdź, czy backend-python-gis i Kafka są uruchomione.'
        );
        this.ingesting.set(false);
        console.error(err);
      },
    });
  }
}
