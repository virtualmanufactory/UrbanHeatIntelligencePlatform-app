import { temperatureColor, temperatureLegendGradient } from './heat-map';

describe('temperatureColor', () => {
  it('should return orange for equal min and max', () => {
    expect(temperatureColor(25, 25, 25)).toBe('#f97316');
  });

  it('should return cooler color for lower temperature', () => {
    const cool = temperatureColor(10, 10, 30);
    const warm = temperatureColor(30, 10, 30);
    expect(cool).not.toBe(warm);
    expect(cool).toContain('hsl(');
    expect(warm).toContain('hsl(');
  });
});

describe('temperatureLegendGradient', () => {
  it('should build a flat gradient when min equals max', () => {
    expect(temperatureLegendGradient(20, 20)).toContain('#f97316');
  });

  it('should build a range gradient for different temperatures', () => {
    const gradient = temperatureLegendGradient(10, 30);
    expect(gradient).toContain('linear-gradient(to right');
    expect(gradient).toContain('hsl(');
  });
});
