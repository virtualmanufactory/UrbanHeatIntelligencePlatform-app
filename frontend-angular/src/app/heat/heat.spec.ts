import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Heat } from './heat';

describe('Heat', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Heat],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('should create the heat page', () => {
    const fixture = TestBed.createComponent(Heat);
    const httpMock = TestBed.inject(HttpTestingController);
    httpMock.expectOne('http://localhost:8080/api/heat').flush([]);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should render the heading', () => {
    const fixture = TestBed.createComponent(Heat);
    const httpMock = TestBed.inject(HttpTestingController);
    httpMock.expectOne('http://localhost:8080/api/heat').flush([]);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Pomiary temperatury miejskiej');
  });
});
