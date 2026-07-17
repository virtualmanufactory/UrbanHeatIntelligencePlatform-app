import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { Ingest } from './ingest';

describe('Ingest', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ingest],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();
  });

  it('should create the ingest page', () => {
    const fixture = TestBed.createComponent(Ingest);
    const httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    httpMock.expectOne('http://localhost:8000/cities').flush([]);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should render the heading', () => {
    const fixture = TestBed.createComponent(Ingest);
    const httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    httpMock.expectOne('http://localhost:8000/cities').flush([]);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Dodaj pomiar miejscowości');
  });
});
