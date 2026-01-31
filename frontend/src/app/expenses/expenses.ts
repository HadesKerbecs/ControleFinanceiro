import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ExpensesService } from './expenses.service';
import { CardsService } from '../cards/cards.service';
import { CategoriesService } from '../categories/categories.service';
import { ExpenseForm } from './expenses-form/expense-form';

import { Router } from '@angular/router';


@Component({
  standalone: true,
  selector: 'app-expenses',
  templateUrl: './expenses.html',
  styleUrls: ['./expenses.scss'],
  imports: [CommonModule, ReactiveFormsModule, ExpenseForm]
})

export class Expenses implements OnInit {
  form;
  expenses: any[] = [];
  cards: any[] = [];
  categories: any[] = [];
  showForm = false;
  selectedExpense: any = null;
  loading = false;


  constructor(
    private fb: FormBuilder,
    private service: ExpensesService,
    private cardsService: CardsService,
    private categoriesService: CategoriesService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      startDate: [null],
      endDate: [null],
      category: [null],
      card: [null],
      status: [null],
    });
  }

  ngOnInit() {
    this.loadSupportData();
    this.applyFilters();
  }


  loadSupportData() {
    this.cardsService.getCards().subscribe(data => {
      this.cards = data;
    });

    this.categoriesService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  applyFilters() {
    const filters: any = { ...this.form.value };
    this.loading = true;

    if (filters.startDate) {
      filters.purchase_date__gte = filters.startDate;
      delete filters.startDate;
    }

    if (filters.endDate) {
      filters.purchase_date__lte = filters.endDate;
      delete filters.endDate;
    }

    if (filters.status === 'paid') {
      filters.concluded = true;
      delete filters.status;
    }

    if (filters.status === 'pending') {
      filters.concluded = false;
      delete filters.status;
    }

    if (filters.category) {
      filters['subcategory__category'] = filters.category;
      delete filters.category;
    }

    this.service.getExpenses(filters).subscribe({
      next: data => {
        this.expenses = data;
        this.loading = false;
        this.cd.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cd.detectChanges();
      }
    });
  }

  clearFilters() {
    this.form.reset({
      startDate: null,
      endDate: null,
      category: null,
      card: null,
      status: null,
    });

    this.applyFilters();
  }

  openForm() {
    this.selectedExpense = null;
    this.showForm = true;
    console.log('showForm =', this.showForm);
  }

  closeForm() {
    this.showForm = false;
    this.selectedExpense = null;
    this.applyFilters();
  }

  editExpense(expense: any) {
    this.selectedExpense = expense;
    this.showForm = true;
  }

  deleteExpense(expense: any) {
    const ok = confirm(`Deseja remover "${expense.description}"?`);
    if (!ok) return;

    this.service.deleteExpense(expense.id).subscribe(() => {
      this.applyFilters();
    });
  }

  payNextInstallment(expense: any) {
  this.service.getInstallments(expense.id).subscribe(installments => {
    const next = installments.find(i => !i.paid);

    if (!next) {
      alert('Todas as parcelas já estão pagas.');
      return;
    }

    this.service.payInstallment(next.id).subscribe(() => {
      this.applyFilters();
    });
  });
}
}


