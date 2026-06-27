import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HeatMeasurement } from './heat-measurement';

@Injectable({ providedIn: 'root' })
export class HeatService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/api/heat';

  getAll(): Observable<HeatMeasurement[]> {
    return this.http.get<HeatMeasurement[]>(this.baseUrl);
  }
}
