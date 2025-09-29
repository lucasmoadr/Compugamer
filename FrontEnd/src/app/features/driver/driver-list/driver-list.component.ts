import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DriverFormComponent } from '../driver-form/driver-form.component';
import { DriverService, Driver } from '@api';

@Component({
  selector: 'app-driver-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DriverFormComponent],
  templateUrl: './driver-list.component.html',
  styleUrls: ['./driver-list.component.css']
})
export class DriverListComponent implements OnInit {
  drivers: Driver[] = [];
  searchTerm = '';

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
        const isEdit = !!this.editing;
        if (!isEdit) {
          // Alta (POST)
          this.driverService.driverPost({ driver: data as Driver }).subscribe({
            next: () => { this.load(); this.closeForm(); },
            error: (e: any) => { console.error('Error creando conductor', e); alert(e.error); }
          });
          return;
        }
        // Edición (PUT)
        const dni = (data.dni ?? this.editing?.dni) as number | undefined;
        if (dni == null) {
          console.error('Error actualizando conductor: DNI no presente');
          return;
        }
        this.driverService.driverDniPut({ dni, driver: data as Driver }).subscribe({
          next: () => { this.load(); this.closeForm(); },
          error: (e: any) => console.error('Error actualizando conductor', e)
        });
      }

  delete(item: Driver) {
    if (item.dni == null) return;
    if (confirm(`¿Eliminar al conductor ${item.name}?`)) {
      this.driverService.driverDniDelete({ dni: item.dni }).subscribe({
        next: () => this.load(),
        error: (e: any) => console.error('Error eliminando conductor', e)
      });
    }
  }

  private load() {
    this.driverService.driverGet().subscribe({
      next: (list: Driver[]) => this.drivers = list ?? [],
      error: (e: any) => { console.error('Error cargando drivers', e); this.drivers = []; }
    });
  }

  get filteredDrivers(): Driver[] {
    const term = (this.searchTerm || '').toLowerCase().trim();
    const base = term
      ? this.drivers.filter(d => `${d.dni}`.includes(term) || (d.name || '').toLowerCase().includes(term))
      : [...this.drivers];
    return base.sort((a, b) => (a.dni ?? 0) - (b.dni ?? 0));
  }
}
