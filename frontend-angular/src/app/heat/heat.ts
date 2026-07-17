import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeatMeasurement } from '../heat-measurement';
import { HeatMap } from '../heat-map/heat-map';
import { HeatService } from '../heat.service';
import { isInPoland } from '../poland';

@Component({
  selector: 'app-heat',
  imports: [DecimalPipe, FormsModule, HeatMap],
  templateUrl: './heat.html',
  styleUrl: './heat.scss',
})
export class Heat {
  private readonly heatService = inject(HeatService);

  protected readonly measurements = signal<HeatMeasurement[]>([]);
  protected readonly selectedDate = signal<string | null>(null);
  protected readonly polishMeasurements = computed(() =>
    this.measurements().filter((measurement) =>
      isInPoland(measurement.latitude, measurement.longitude)
    )
  );
  protected readonly availableDates = computed(() => {
    const dates = [
      ...new Set(
        this.polishMeasurements()
          .map((measurement) => measurement.measurementDate)
          .filter((date): date is string => Boolean(date))
      ),
    ];
    return dates.sort().reverse();
  });
  protected readonly displayedMeasurements = computed(() => {
    const selectedDate = this.selectedDate();
    if (!selectedDate) {
      return this.polishMeasurements();
    }
    return this.polishMeasurements().filter(
      (measurement) => measurement.measurementDate === selectedDate
    );
  });
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly count = computed(() => this.displayedMeasurements().length);
  protected readonly avgTemperature = computed(() => {
    const list = this.displayedMeasurements();
    if (list.length === 0) {
      return null;
    }
    const sum = list.reduce((acc, m) => acc + m.temperature, 0);
    return sum / list.length;
  });
  protected readonly maxTemperature = computed(() => {
    const list = this.displayedMeasurements();
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
        this.syncSelectedDate(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(
          'Nie udało się pobrać danych z backendu (http://localhost:8080/api/heat). ' +
            'Upewnij się, że backend jest uruchomiony.'
        );
        this.loading.set(false);
        console.error(err);
      },
    });
  }

  private syncSelectedDate(measurements: HeatMeasurement[]): void {
    const dates = [
      ...new Set(
        measurements
          .filter((measurement) =>
            isInPoland(measurement.latitude, measurement.longitude)
          )
          .map((measurement) => measurement.measurementDate)
          .filter((date): date is string => Boolean(date))
      ),
    ].sort().reverse();

    if (dates.length === 0) {
      this.selectedDate.set(null);
      return;
    }

    const currentDate = this.selectedDate();
    if (!currentDate || !dates.includes(currentDate)) {
      this.selectedDate.set(dates[0]);
    }
  }
}
