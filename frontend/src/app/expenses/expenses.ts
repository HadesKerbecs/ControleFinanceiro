import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ExpensesService } from './expenses.service';
import { CardsService } from '../cards/cards.service';
import { CategoriesService } from '../categories/categories.service';
import { ExpenseForm } from './expenses-form/expense-form';

import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';

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

  loadingList = false;
  paying = false;

  confirmDelete = false;
  expenseToDelete: any = null;

  constructor(
    private fb: FormBuilder,
    private service: ExpensesService,
    private cardsService: CardsService,
    private categoriesService: CategoriesService,
    private toastr: ToastrService,
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
    this.cardsService.getCards().subscribe(data => this.cards = data);
    this.categoriesService.getCategories().subscribe(data => this.categories = data);
  }

  applyFilters() {
    const filters: any = { ...this.form.value };
    this.loadingList = true;

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
      filters['subcategory__category__id'] = Number(filters.category);
      delete filters.category;
    }

    this.service.getExpenses(filters)
      .pipe(finalize(() => {
        this.loadingList = false;
        this.cd.detectChanges();
      }))
      .subscribe({
        next: data => {
          this.expenses = data;
          this.cd.detectChanges();
        },
        error: () => {
          this.toastr.error('Erro ao carregar despesas');
          this.cd.detectChanges();
        }
      });

  }

  clearFilters() {
    this.form.reset();
    this.applyFilters();
  }

  openForm() {
    this.selectedExpense = null;
    this.showForm = true;
  }

  closeForm(reload = false) {
    this.showForm = false;
    this.selectedExpense = null;

    if (reload) {
      this.applyFilters();
    }
  }

  editExpense(expense: any) {
    this.selectedExpense = expense;
    this.showForm = true;

    setTimeout(() => {
      this.selectedExpense = expense;
      this.showForm = true;
    });
  }

  openDeleteConfirm(expense: any) {
    this.expenseToDelete = expense;
    this.confirmDelete = true;
    this.cd.detectChanges();
  }

  cancelDelete() {
    this.confirmDelete = false;
    this.expenseToDelete = null;
    this.cd.detectChanges();
  }

  confirmDeleteExpense() {
    if (!this.expenseToDelete) return;

    const id = this.expenseToDelete.id;

    this.service.deleteExpense(id).subscribe({
      next: () => {
        this.toastr.success('Despesa removida');

        // 🔥 remove da lista
        this.expenses = this.expenses.filter(e => e.id !== id);

        // 🔥 fecha modal
        this.confirmDelete = false;
        this.expenseToDelete = null;

        // 🔥 FORÇA atualização visual (DO JEITO QUE VOCÊ QUER)
        this.cd.detectChanges();
      },
      error: () => {
        this.toastr.error('Erro ao remover despesa');
        this.cd.detectChanges();
      }
    });
  }

  undoPayment(expense: any) {
    if (this.loadingList) return;

    this.loadingList = true;

    this.service.getInstallments(expense.id).subscribe(installments => {

      // última parcela paga
      const lastPaid = [...installments]
        .reverse()
        .find(i => i.paid);

      if (!lastPaid) {
        this.loadingList = false;
        this.toastr.info('Nenhum pagamento para desfazer');
        this.cd.detectChanges();
        return;
      }

      this.service.unpayInstallment(lastPaid.id)
        .pipe(finalize(() => {
          this.loadingList = false;
          this.cd.detectChanges();
        }))
        .subscribe(() => {
          this.toastr.success('Pagamento desfeito');

          expense.remaining_installments++;
          expense.concluded = false;

          this.cd.detectChanges();
        });
    });
  }

  // 🔥 PAGAMENTO CORRETO (SEM REFRESH, SEM BUG)
  payNextInstallment(expense: any) {
    if (this.loadingList || expense.concluded) return;

    this.loadingList = true;

    this.service.getInstallments(expense.id).subscribe(installments => {
      const next = installments.find(i => !i.paid);
      if (!next) {
        this.loadingList = false;
        this.cd.detectChanges();
        return;
      }

      this.service.payInstallment(next.id)
        .pipe(finalize(() => {
          this.loadingList = false;
          this.cd.detectChanges(); // ✅ depois do async
        }))
        .subscribe(() => {
          this.toastr.success('Pagamento realizado');

          // 🔥 atualização local imediata
          expense.remaining_installments--;

          if (expense.remaining_installments <= 0) {
            expense.concluded = true;
          }

          this.cd.detectChanges(); // ✅ força repaint final
        });
    });
  }

  getPaymentLabel(expense: any): string {
    switch (expense.payment_type) {
      case 'CARTAO':
        return `Cartão: ${expense.card_detail?.bank_name} • ${expense.card_detail?.brand}`;
      case 'PIX':
        return 'Pagamento: Pix';
      case 'DINHEIRO':
        return 'Pagamento: Dinheiro';
      case 'FIADO':
        return 'Pagamento: Fiado';
      default:
        return '';
    }
  }
}
