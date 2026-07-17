export const POLAND_BOUNDS = {
  minLatitude: 49.0,
  maxLatitude: 54.9,
  minLongitude: 14.1,
  maxLongitude: 24.2,
} as const;

export const POLAND_MAP_CENTER: [number, number] = [52.0, 19.0];
export const POLAND_MAP_ZOOM = 6;

export function isInPoland(latitude: number, longitude: number): boolean {
  return (
    latitude >= POLAND_BOUNDS.minLatitude &&
    latitude <= POLAND_BOUNDS.maxLatitude &&
    longitude >= POLAND_BOUNDS.minLongitude &&
    longitude <= POLAND_BOUNDS.maxLongitude
  );
}

export function getPolandLeafletBounds(): [[number, number], [number, number]] {
  return [
    [POLAND_BOUNDS.minLatitude, POLAND_BOUNDS.minLongitude],
    [POLAND_BOUNDS.maxLatitude, POLAND_BOUNDS.maxLongitude],
  ];
}
