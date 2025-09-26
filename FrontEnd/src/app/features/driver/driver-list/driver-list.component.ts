import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DriverFormComponent } from '../driver-form/driver-form.component';
import { DriverService, Driver } from '@api';

@Component({
  selector: 'app-driver-list',
  standalone: true,
  imports: [CommonModule, DriverFormComponent],
  templateUrl: './driver-list.component.html',
  styleUrls: ['./driver-list.component.css']
})
export class DriverListComponent implements OnInit {
  drivers: Driver[] = [];

  showForm = false;
  editing: Driver | null = null;

  constructor(private driverService: DriverService) {}

  ngOnInit(): void {
    this.load();
  }

  openForm(item?: Driver) {
    this.editing = item ? { ...item } : null;
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.editing = null;
  }

  onSaved(data: Partial<Driver>) {
    if (!data.id) {
      this.driverService.driverPost({ driver: data as Driver }).subscribe({
        next: () => { this.load(); this.closeForm(); },
        error: (e: any) => console.error('Error creando driver', e)
      });
      return;
    }
    this.driverService.driverIdPut({ id: data.id, driver: data as Driver }).subscribe({
      next: () => { this.load(); this.closeForm(); },
      error: (e: any) => console.error('Error actualizando driver', e)
    });
  }

  delete(item: Driver) {
    if (item.id == null) return;
    if (confirm(`¿Eliminar al conductor ${item.name}?`)) {
      this.driverService.driverIdDelete({ id: item.id }).subscribe({
        next: () => this.load(),
        error: (e: any) => console.error('Error eliminando driver', e)
      });
    }
  }

  private load() {
    this.driverService.driverGet().subscribe({
      next: (list: Driver[]) => this.drivers = list ?? [],
      error: (e: any) => { console.error('Error cargando drivers', e); this.drivers = []; }
    });
  }
}
