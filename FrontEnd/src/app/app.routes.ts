import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'buses' },
  {
    path: 'buses',
    loadComponent: () =>
      import('./features/bus/bus-list/bus-list.component').then(m => m.BusListComponent),
  },
  {
    path: 'drivers',
    loadComponent: () =>
      import('./features/driver/driver-list/driver-list.component').then(m => m.DriverListComponent),
  },
  {
    path: 'students',
    loadComponent: () =>
      import('./features/student/student-list/student-list.component').then(m => m.StudentListComponent),
  },
  { path: '**', redirectTo: 'buses' }
];
