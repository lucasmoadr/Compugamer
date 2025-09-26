import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusFormComponent } from '../bus-form/bus-form.component';
import { BusService, Bus } from '@api';

@Component({
  selector: 'app-bus-list',
  standalone: true,
  imports: [CommonModule, BusFormComponent],
  templateUrl: './bus-list.component.html',
  styleUrls: ['./bus-list.component.css']
})
export class BusListComponent implements OnInit {
  buses: Bus[] = [];

  showForm = false;
  editingBus: Bus | null = null;
  constructor(private busService: BusService) {}

  ngOnInit(): void {
    this.loadBuses();
  }

  openBusForm(bus?: Bus) {
    this.editingBus = bus ? { ...bus } : null;
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.editingBus = null;
  }

  onSaved(busData: Partial<Bus>) {
    // Crear
    if (!busData.id) {
      this.busService.busPost({ bus: busData as Bus }).subscribe({
        next: () => { this.loadBuses(); this.closeForm(); },
        error: (e: any) => console.error('Error creando bus', e)
      });
      return;
    }
    // Actualizar
    this.busService.busIdPut({ id: busData.id, bus: busData as Bus }).subscribe({
      next: () => { this.loadBuses(); this.closeForm(); },
      error: (e: any) => console.error('Error actualizando bus', e)
    });
  }

  deleteBus(bus: Bus) {
    if (bus.id == null) return;
    if (confirm(`¿Está seguro que desea eliminar el bus con patente ${bus.plate}?`)) {
      this.busService.busIdDelete({ id: bus.id }).subscribe({
        next: () => this.loadBuses(),
        error: (e: any) => console.error('Error eliminando bus', e)
      });
    }
  }

  private loadBuses() {
    this.busService.busGet().subscribe({
      next: (list: Bus[]) => this.buses = list ?? [],
      error: (e: any) => { console.error('Error cargando buses', e); this.buses = []; }
    });
  }
}
