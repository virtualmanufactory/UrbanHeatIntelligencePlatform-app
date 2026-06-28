import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IngestPoint, IngestRequest, IngestResponse } from './ingest.models';

@Injectable({ providedIn: 'root' })
export class IngestService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8000';

  getCities(): Observable<IngestPoint[]> {
    return this.http.get<IngestPoint[]>(`${this.baseUrl}/cities`);
  }

  ingest(request?: IngestRequest): Observable<IngestResponse> {
    return this.http.post<IngestResponse>(`${this.baseUrl}/ingest`, request ?? {});
  }
}
