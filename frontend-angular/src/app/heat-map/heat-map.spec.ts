import { TestBed } from '@angular/core/testing';
import { HeatMap } from './heat-map';

describe('HeatMap', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeatMap],
    }).compileComponents();
  });

  it('should create the map component', () => {
    const fixture = TestBed.createComponent(HeatMap);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
