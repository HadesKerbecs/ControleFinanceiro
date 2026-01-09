import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ExpensesService } from './expenses.service';

@Component({
  standalone: true,
  selector: 'app-expenses',
  templateUrl: './expenses.html',
  styleUrls: ['./expenses.scss'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class Expenses {
  form;

  constructor(
    private fb: FormBuilder,
    private service: ExpensesService
  ) {
  this.form = this.fb.group({
    startDate: [''],
    endDate: [''],
    category: [''],
    card: [''],
    status: [''],
  });
  }

  applyFilters() {
    this.service.getExpenses(this.form.value).subscribe();
  }

  clearFilters() {
    this.form.reset();
    this.applyFilters();
  }
}
