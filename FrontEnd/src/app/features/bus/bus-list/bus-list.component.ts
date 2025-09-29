import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BusFormComponent } from '../bus-form/bus-form.component';
import { BusService, Bus } from '@api';
import { DriverService, Driver, StudentService, Student } from '@api';

@Component({
  selector: 'app-bus-list',
  standalone: true,
  imports: [CommonModule, FormsModule, BusFormComponent],
  templateUrl: './bus-list.component.html',
  styleUrls: ['./bus-list.component.css']
})
export class BusListComponent implements OnInit {
  buses: Bus[] = [];

  // For assignments
  drivers: Driver[] = [];
  students: Student[] = [];
  availableDrivers: Driver[] = [];
  availableStudents: Student[] = [];
  driverSearch = '';
  studentSearch = '';
  assignDriverBusId: number | null = null;
  selectedDriverDni: number | null = null;
  assignStudentsBusId: number | null = null;
  selectedStudentDnis: number[] = [];

  // Alerts
  successMessage: string | null = null;
  errorMessage: string | null = null;

  showForm = false;
  editingBus: Bus | null = null;
  constructor(
    private busService: BusService,
    private driverService: DriverService,
    private studentService: StudentService,
  ) {}

  ngOnInit(): void {
    this.loadBuses();
    this.loadDriversAndStudents();
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

  private loadDriversAndStudents() {
    this.driverService.driverGet().subscribe({
      next: (list: Driver[]) => this.drivers = list ?? [],
      error: (e: any) => { console.error('Error cargando conductores', e); this.drivers = []; }
    });
    this.studentService.studentGet().subscribe({
      next: (list: Student[]) => this.students = list ?? [],
      error: (e: any) => { console.error('Error cargando estudiantes', e); this.students = []; }
    });
  }

  // Assign Driver modal handlers
  openAssignDriver(bus: Bus) {
    if (bus.id == null) return;
    this.assignDriverBusId = bus.id;
    this.selectedDriverDni = null;
    // Only show drivers not assigned to any bus or already assigned to this bus
    this.availableDrivers = (this.drivers || []).filter(d => d.busId == null || d.busId === bus.id);
    this.driverSearch = '';
  }
  closeAssignDriver() { this.assignDriverBusId = null; this.selectedDriverDni = null; }
  confirmAssignDriver() {
    this.errorMessage = null;
    if (this.assignDriverBusId == null || this.selectedDriverDni == null) return;
    this.busService.busBusIdAssignDriverDriverDniPost({ busId: this.assignDriverBusId, driverDni: this.selectedDriverDni }).subscribe({
      next: () => {
        this.successMessage = `Chofer asignado correctamente al bus ${this.assignDriverBusId}`;
        this.closeAssignDriver();        
        this.loadDriversAndStudents();
        this.loadBuses();
      },
      error: (e: any) => {
        console.error('Error asignando chofer', e);
        this.errorMessage = 'No se pudo asignar el chofer. Verifique que no esté asignado a otro bus.';
        this.successMessage = null;
      }
    });
  }

  // Assign Students modal handlers
  openAssignStudents(bus: Bus) {
    if (bus.id == null) return;
    this.assignStudentsBusId = bus.id;
    this.selectedStudentDnis = [];
    // Only show students not assigned to any bus or already assigned to this bus
    this.availableStudents = (this.students || []).filter(s => s.busId == null || s.busId === bus.id);
    this.studentSearch = '';
  }
  closeAssignStudents() { this.assignStudentsBusId = null; this.selectedStudentDnis = []; }
  confirmAssignStudents() {
    if (this.assignStudentsBusId == null || !this.selectedStudentDnis?.length) { this.closeAssignStudents(); return; }
    const busId = this.assignStudentsBusId;
    let remaining = this.selectedStudentDnis.length;
    this.selectedStudentDnis.forEach(dni => {
      this.busService.busBusIdAssignStudentStudentDniPost({ busId, studentDni: dni }).subscribe({
        next: () => {
          remaining -= 1;
          if (remaining === 0) {
            this.successMessage = `Se asignaron ${this.selectedStudentDnis.length} estudiante(s) al bus ${busId}`;
            this.errorMessage = null;
            this.closeAssignStudents();
            this.loadDriversAndStudents();
            this.loadBuses();
          }
        },
        error: (e: any) => {
          console.error('Error asignando estudiante', e);
          this.errorMessage = 'No se pudo asignar uno o más estudiantes. Verifique que no estén asignados a otro bus.';
          this.successMessage = null;
        }
      });
    });
  }

  // Helpers for display
  driverLabelForBus(busId: number | undefined | null): string {
    if (busId == null) return '-';
    const d = this.drivers.find(x => x.busId === busId);
    if (!d) return '-';
    const name = d.name ?? '';
    return name ? `${name} (DNI: ${d.dni})` : `DNI: ${d.dni}`;
  }

  studentCountForBus(busId: number | undefined | null): number {
    if (busId == null) return 0;
    return this.students.filter(s => s.busId === busId).length;
  }

  studentNamesForBus(busId: number | undefined | null): string[] {
    if (busId == null) return [];
    return this.students
      .filter(s => s.busId === busId)
      .map(s => {
        const name = s.name || '';
        return name ? `${name} (DNI: ${s.dni})` : `DNI: ${s.dni}`;
      });
  }

  // Filtered lists for UI (by name or DNI substring)
  get filteredAvailableDrivers(): Driver[] {
    const term = (this.driverSearch || '').toString().toLowerCase().trim();
    if (!term) return this.availableDrivers;
    return this.availableDrivers.filter(d => `${d.dni}`.includes(term) || (d.name || '').toLowerCase().includes(term));
  }

  get filteredAvailableStudents(): Student[] {
    const term = (this.studentSearch || '').toString().toLowerCase().trim();
    if (!term) return this.availableStudents;
    return this.availableStudents.filter(s => `${s.dni}`.includes(term) || (s.name || '').toLowerCase().includes(term));
  }
}
