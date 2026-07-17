export interface HeatMeasurement {
  id?: number;
  name?: string;
  latitude: number;
  longitude: number;
  temperature: number;
  measurementDate?: string;
}
