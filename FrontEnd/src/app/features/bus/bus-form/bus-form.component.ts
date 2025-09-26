import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-bus-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './bus-form.component.html',
  styleUrls: ['./bus-form.component.css']
})
export class BusFormComponent implements OnInit {
  @Input() bus: any;
  @Input() isEdit = false;
  @Output() busSaved = new EventEmitter<any>();
  @Output() cancelled = new EventEmitter<void>();

  busForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.busForm = this.fb.group({
      plate: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {
    if (this.bus) {
      this.busForm.patchValue(this.bus);
    }
  }

  onSubmit() {
    if (this.busForm.valid) {
      const busData: any = this.busForm.value; // { plate }
      if (this.isEdit && this.bus) {
        busData.id = this.bus.id;
      }
      this.busSaved.emit(busData);
    } else {
      Object.keys(this.busForm.controls).forEach(key => {
        this.busForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel() {
    this.cancelled.emit();
  }
}
