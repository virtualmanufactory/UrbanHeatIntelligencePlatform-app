import { isInPoland, POLAND_BOUNDS } from './poland';

describe('isInPoland', () => {
  it('should accept coordinates inside Poland', () => {
    expect(isInPoland(52.2297, 21.0122)).toBeTrue();
    expect(isInPoland(POLAND_BOUNDS.minLatitude, POLAND_BOUNDS.minLongitude)).toBeTrue();
    expect(isInPoland(POLAND_BOUNDS.maxLatitude, POLAND_BOUNDS.maxLongitude)).toBeTrue();
  });

  it('should reject coordinates outside Poland', () => {
    expect(isInPoland(40.7128, -74.006)).toBeFalse();
    expect(isInPoland(48.9, 21.0)).toBeFalse();
    expect(isInPoland(52.0, 13.9)).toBeFalse();
  });
});
