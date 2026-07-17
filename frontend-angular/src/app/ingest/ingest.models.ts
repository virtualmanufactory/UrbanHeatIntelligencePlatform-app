export interface IngestPoint {
  name: string;
  latitude: number;
  longitude: number;
}

export interface IngestRequest {
  date?: string;
  points?: IngestPoint[];
}

export interface IngestMeasurement {
  name?: string;
  latitude: number;
  longitude: number;
  temperature: number;
  measurementDate: string;
}

export interface IngestResponse {
  mode: string;
  topic: string;
  published: number;
  measurements: IngestMeasurement[];
}
