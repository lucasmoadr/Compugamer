import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentFormComponent } from '../student-form/student-form.component';
import { StudentService, Student, BusService, Bus } from '@api';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, FormsModule, StudentFormComponent],
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {
  students: Student[] = [];
  searchTerm = '';

  showForm = false;
  editing: Student | null = null;
  buses: Bus[] = [];

  constructor(private studentService: StudentService, private busService: BusService) {}

  ngOnInit(): void { this.load(); this.loadBuses(); }

  openForm(item?: Student) { this.editing = item ? { ...item } : null; this.showForm = true; }
  closeForm() { this.showForm = false; this.editing = null; }

  onSaved(data: Partial<Student>) {
    const isEdit = !!this.editing;
    if (!isEdit) {
      // Alta (POST)
      this.studentService.studentPost({ student: data as Student }).subscribe({
        next: () => { this.load(); this.closeForm(); },
        error: (e: any) => { console.error('Error creando estudiante', e); alert(e.error); }
      });
      return;
    }
    // Edición (PUT)
    const dni = (data.dni ?? this.editing?.dni) as number | undefined;
    if (dni == null) {
      console.error('Error actualizando estudiante: DNI no presente');
      return;
    }
    this.studentService.studentDniPut({ dni, student: data as Student }).subscribe({
      next: () => { this.load(); this.closeForm(); },
      error: (e: any) => console.error('Error actualizando estudiante', e)
    });
  }

  delete(item: Student) {
    if (item.dni == null) return;
    if (confirm(`¿Eliminar al estudiante ${item.name}?`)) {
      this.studentService.studentDniDelete({ dni: item.dni }).subscribe({
        next: () => this.load(),
        error: (e: any) => console.error('Error eliminando estudiante', e)
      });
    }
  }

  private load() {
    this.studentService.studentGet().subscribe({
      next: (list: Student[]) => this.students = list ?? [],
      error: (e: any) => { console.error('Error cargando estudiantes', e); this.students = []; }
    });
  }

  private loadBuses() {
    this.busService.busGet().subscribe({
      next: (list: Bus[]) => this.buses = list ?? [],
      error: (e: any) => { console.error('Error cargando buses', e); this.buses = []; }
    });
  }

  get filteredStudents(): Student[] {
    const term = (this.searchTerm || '').toLowerCase().trim();
    const base = term
      ? this.students.filter(s => `${s.dni}`.includes(term) || (s.name || '').toLowerCase().includes(term))
      : [...this.students];
    return base.sort((a, b) => (a.dni ?? 0) - (b.dni ?? 0));
  }

  busLabelForStudent(s: Student): string {
    if (s.busId == null) return '-';
    const bus = this.buses.find(b => b.id === s.busId);
    if (!bus) return `Bus ${s.busId}`;
    return bus.plate ? `${bus.plate} (ID: ${bus.id})` : `Bus ${bus.id}`;
  }
}
