import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.css']
})
export class StudentFormComponent implements OnInit {
  @Input() student: any;
  @Input() isEdit = false;
  @Output() saved = new EventEmitter<any>();
  @Output() cancelled = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      dni: [null, [Validators.required, Validators.min(1000000), Validators.max(99999999)]],
      age: [null, [Validators.required, Validators.min(3), Validators.max(21)]]
    });
  }

  ngOnInit(): void {
    if (this.student) {
      this.form.patchValue(this.student);
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const data: any = this.form.value;
      if (this.isEdit && this.student) data.id = this.student.id;
      this.saved.emit(data);
    } else {
      Object.values(this.form.controls).forEach(c => c.markAsTouched());
    }
  }

  onCancel() { this.cancelled.emit(); }
}

