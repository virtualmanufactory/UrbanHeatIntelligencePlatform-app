import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeatMeasurement } from '../heat-measurement';
import { HeatMap } from '../heat-map/heat-map';
import { HeatService } from '../heat.service';
import { I18nService } from '../i18n/i18n.service';
import { TranslatePipe } from '../i18n/translate.pipe';
import { isInPoland } from '../poland';

@Component({
  selector: 'app-heat',
  imports: [DecimalPipe, FormsModule, HeatMap, TranslatePipe],
  templateUrl: './heat.html',
  styleUrl: './heat.scss',
})
export class Heat {
  private readonly heatService = inject(HeatService);
  private readonly i18n = inject(I18nService);

  protected readonly allMeasurements = signal<HeatMeasurement[]>([]);
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
        this.allMeasurements()
          .map((measurement) => measurement.measurementDate)
          .filter((date): date is string => Boolean(date))
      ),
    ];
    return dates.sort().reverse();
  });
  protected readonly loading = signal(false);
  protected readonly fetching = signal(false);
  protected readonly deletingId = signal<number | null>(null);
  protected readonly error = signal<string | null>(null);

  protected readonly count = computed(() => this.polishMeasurements().length);
  protected readonly avgTemperature = computed(() => {
    const list = this.polishMeasurements();
    if (list.length === 0) {
      return null;
    }
    const sum = list.reduce((acc, m) => acc + m.temperature, 0);
    return sum / list.length;
  });
  protected readonly maxTemperature = computed(() => {
    const list = this.polishMeasurements();
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
        this.allMeasurements.set(data);
        this.syncSelectedDate(data);
        this.loading.set(false);
        this.fetchByDate();
      },
      error: (err) => {
        this.error.set(this.i18n.t('heat.errorLoad'));
        this.loading.set(false);
        console.error(err);
      },
    });
  }

  protected onSelectedDateChange(date: string | null): void {
    this.selectedDate.set(date || null);
    this.fetchByDate();
  }

  protected fetchByDate(): void {
    const date = this.selectedDate();
    if (!date) {
      this.measurements.set([]);
      this.error.set(this.i18n.t('heat.errorSelectDate'));
      return;
    }

    this.fetching.set(true);
    this.error.set(null);
    this.heatService.getByDate(date).subscribe({
      next: (data) => {
        this.measurements.set(data);
        this.fetching.set(false);
      },
      error: (err) => {
        this.error.set(this.i18n.t('heat.errorFetchByDate'));
        this.fetching.set(false);
        console.error(err);
      },
    });
  }

  protected deleteMeasurement(measurement: HeatMeasurement): void {
    if (measurement.id == null) {
      return;
    }

    this.deletingId.set(measurement.id);
    this.error.set(null);
    this.heatService.delete(measurement.id).subscribe({
      next: () => {
        this.deletingId.set(null);
        this.load();
      },
      error: (err) => {
        this.error.set(this.i18n.t('heat.errorDelete'));
        this.deletingId.set(null);
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
      this.selectedDate.set(new Date().toISOString().slice(0, 10));
      return;
    }

    const currentDate = this.selectedDate();
    if (!currentDate || !dates.includes(currentDate)) {
      this.selectedDate.set(dates[0]);
    }
  }
}
