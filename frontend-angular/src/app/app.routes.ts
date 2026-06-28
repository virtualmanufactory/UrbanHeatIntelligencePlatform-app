import { Routes } from '@angular/router';
import { Heat } from './heat/heat';
import { Ingest } from './ingest/ingest';

export const routes: Routes = [
  { path: '', component: Heat },
  { path: 'ingest', component: Ingest },
  { path: '**', redirectTo: '' },
];
