import { Component, EventEmitter, Input, Output, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ExpensesService } from '../expenses.service';
import { CardsService } from '../../cards/cards.service';
import { CategoriesService } from '../../categories/categories.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  standalone: true,
  selector: 'app-expense-form',
  templateUrl: './expense-form.html',
  styleUrls: ['./expense-form.scss'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class ExpenseForm implements OnInit, OnChanges {
  @Input() expense: any;
  @Output() saved = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  form;
  cards: any[] = [];
  categories: any[] = [];
  subcategories: any[] = [];

  constructor(
    private fb: FormBuilder,
    private service: ExpensesService,
    private cardsService: CardsService,
    private categoriesService: CategoriesService,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      description: ['', Validators.required],
      category: [null, Validators.required],
      subcategory: [null, Validators.required],
      total_value: ['', Validators.required],
      purchase_date: ['', Validators.required],
      payment_type: [null, Validators.required],
      card: [null],
      installments_quantity: [1, [Validators.required, Validators.min(1)]],
      debito_automatico: [false]
    });
  }

  ngOnInit() {
    this.cardsService.getCards().subscribe(r => {
      this.cards = r;

      // 🔥 AGORA o select já tem opções
      if (this.expense?.card) {
        this.form.get('card')!.setValue(this.expense.card);
      }
    });

    this.form.get('category')!.valueChanges.subscribe(categoryId => {
      this.subcategories = [];
      this.form.get('subcategory')!.setValue(null);

      if (categoryId) {
        this.categoriesService.getSubCategories(categoryId).subscribe(r => {
          this.subcategories = r;
          setTimeout(() => { }, 0);
        });
      }
    });

    this.categoriesService.getCategories().subscribe(r => {
      this.categories = r;
    });

    this.cardsService.getCards().subscribe(r => {
      this.cards = r;
      if (this.expense?.card) {
        this.form.get('card')!.setValue(this.expense.card);
      }
    });

    // ✅ APENAS UM valueChanges
    this.form.get('category')!.valueChanges.subscribe(categoryId => {
      this.subcategories = [];
      this.form.get('subcategory')!.setValue(null);

      if (categoryId) {
        this.categoriesService
          .getSubCategories(categoryId)
          .subscribe(r => this.subcategories = r);
      }
    });

    this.form.get('payment_type')!.valueChanges.subscribe(value => {
      if (value !== 'CARTAO') {
        this.form.get('card')!.setValue(null);
      }
    });

    this.form.get('category')!.valueChanges.subscribe(categoryId => {
      this.subcategories = [];
      this.form.get('subcategory')!.setValue(null);

      if (categoryId) {
        this.categoriesService
          .getSubCategories(categoryId)
          .subscribe(r => (this.subcategories = r));
      }
    });

    this.form.get('payment_type')!.valueChanges.subscribe(value => {
      if (value !== 'CARTAO') {
        this.form.get('card')!.setValue(null);
      }
    });

    if (this.expense) {
      const formattedValue = new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(this.expense.total_value);

      const categoryId = this.expense.subcategory_detail?.category;

      this.form.patchValue({
        description: this.expense.description,
        category: categoryId,
        subcategory: this.expense.subcategory,
        total_value: formattedValue,
        purchase_date: this.expense.purchase_date,
        payment_type: this.expense.payment_type,
        card: this.expense.card ?? null,
        installments_quantity: this.expense.installments_quantity,
        debito_automatico: this.expense.debito_automatico ?? false
      });

      if (categoryId) {
        this.categoriesService
          .getSubCategories(categoryId)
          .subscribe(r => (this.subcategories = r));
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes['expense'] || !this.expense) return;

    const formattedValue = new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(this.expense.total_value);

    const categoryId = this.expense.subcategory_detail?.category;

    // patch inicial
    this.form.patchValue({
      description: this.expense.description,
      category: categoryId,
      subcategory: null, // força reset
      total_value: formattedValue,
      purchase_date: this.expense.purchase_date,
      payment_type: this.expense.payment_type,
      card: this.expense.card ?? null,
      installments_quantity: this.expense.installments_quantity,
      debito_automatico: this.expense.debito_automatico ?? false
    });

    if (categoryId) {
      this.categoriesService.getSubCategories(categoryId).subscribe(r => {
        this.subcategories = r;
        this.form.get('subcategory')!.setValue(this.expense.subcategory);
      });
    }
  }

  formatValue() {
    const ctrl = this.form.get('total_value');
    if (!ctrl || !ctrl.value) return;

    const digits = ctrl.value.replace(/\D/g, '');
    if (!digits) {
      ctrl.setValue('');
      return;
    }

    ctrl.setValue(
      new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(Number(digits) / 100)
    );
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value: any = this.form.value;

    if (value.payment_type === 'CARTAO' && !value.card) {
      this.toastr.error('Selecione um cartão');
      return;
    }

    const payload = {
      description: value.description,
      subcategory: value.subcategory,
      payment_type: value.payment_type,
      card: value.payment_type === 'CARTAO' ? value.card : null,
      total_value: Number(
        String(value.total_value).replace(/\./g, '').replace(',', '.')
      ),
      purchase_date: value.purchase_date,
      installments_quantity: value.installments_quantity,
      debito_automatico: value.payment_type === 'CARTAO'
        ? value.debito_automatico
        : false
    };

    const req$ = this.expense
      ? this.service.updateExpense(this.expense.id, payload)
      : this.service.createExpense(payload);

    req$.subscribe({
      next: () => {
        this.toastr.success(
          this.expense ? 'Despesa atualizada' : 'Despesa cadastrada'
        );
        this.saved.emit();
      },
      error: (err) => {
        console.error(err.error);
        this.toastr.error('Erro ao salvar despesa');
      }
    });
  }

  close() {
    this.cancel.emit();
  }
}
