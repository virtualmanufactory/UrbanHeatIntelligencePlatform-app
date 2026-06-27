import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { HeatMeasurement } from './heat-measurement';
import { HeatService } from './heat.service';

@Component({
  selector: 'app-root',
  imports: [DecimalPipe],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly heatService = inject(HeatService);

  protected readonly measurements = signal<HeatMeasurement[]>([]);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly count = computed(() => this.measurements().length);
  protected readonly avgTemperature = computed(() => {
    const list = this.measurements();
    if (list.length === 0) {
      return null;
    }
    const sum = list.reduce((acc, m) => acc + m.temperature, 0);
    return sum / list.length;
  });
  protected readonly maxTemperature = computed(() => {
    const list = this.measurements();
    if (list.length === 0) {
      return null;
    }
    return Math.max(...list.map((m) => m.temperature));
  });

  constructor() {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.heatService.getAll().subscribe({
      next: (data) => {
        this.measurements.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(
          'Nie udało się pobrać danych z backendu (http://localhost:8080/api/heat). ' +
            'Upewnij się, że backend jest uruchomiony.'
        );
        this.loading.set(false);
        console.error(err);
      }
    });
  }
}
