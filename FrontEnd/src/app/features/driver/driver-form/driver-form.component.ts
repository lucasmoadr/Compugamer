import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-driver-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './driver-form.component.html',
  styleUrls: ['./driver-form.component.css']
})
export class DriverFormComponent implements OnInit {
  @Input() driver: any;
  @Input() isEdit = false;
  @Output() saved = new EventEmitter<any>();
  @Output() cancelled = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      age: [null, [Validators.required, Validators.min(18), Validators.max(90)]],
      licenseNumber: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    if (this.driver) {
      this.form.patchValue(this.driver);
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const data: any = this.form.value;
      if (this.isEdit && this.driver) data.id = this.driver.id;
      this.saved.emit(data);
    } else {
      Object.values(this.form.controls).forEach(c => c.markAsTouched());
    }
  }

  onCancel() {
    this.cancelled.emit();
  }
}
