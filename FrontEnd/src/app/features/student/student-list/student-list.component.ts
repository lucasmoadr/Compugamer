import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentFormComponent } from '../student-form/student-form.component';
import { StudentService, Student } from '@api';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, StudentFormComponent],
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {
  students: Student[] = [];

  showForm = false;
  editing: Student | null = null;

  constructor(private studentService: StudentService) {}

  ngOnInit(): void { this.load(); }

  openForm(item?: Student) { this.editing = item ? { ...item } : null; this.showForm = true; }
  closeForm() { this.showForm = false; this.editing = null; }

  onSaved(data: Partial<Student>) {
    if (!data.id) {
      this.studentService.studentPost({ student: data as Student }).subscribe({
        next: () => { this.load(); this.closeForm(); },
        error: (e: any) => console.error('Error creando estudiante', e)
      });
      return;
    }
    this.studentService.studentIdPut({ id: data.id, student: data as Student }).subscribe({
      next: () => { this.load(); this.closeForm(); },
      error: (e: any) => console.error('Error actualizando estudiante', e)
    });
  }

  delete(item: Student) {
    if (item.id == null) return;
    if (confirm(`¿Eliminar al estudiante ${item.name}?`)) {
      this.studentService.studentIdDelete({ id: item.id }).subscribe({
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
}
