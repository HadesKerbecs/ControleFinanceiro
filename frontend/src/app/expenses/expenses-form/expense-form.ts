import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ExpensesService } from '../expenses.service';
import { CardsService } from '../../cards/cards.service';

@Component({
    standalone: true,
    selector: 'app-expense-form',
    templateUrl: './expense-form.html',
    styleUrls: ['./expense-form.scss'],
    imports: [CommonModule, ReactiveFormsModule]
})
export class ExpenseForm {
    @Output() saved = new EventEmitter<void>();
    @Output() cancel = new EventEmitter<void>();
    @Input() expense: any;

    form;
    cards: any[] = [];

    constructor(
        private fb: FormBuilder,
        private service: ExpensesService,
        private cardsService: CardsService
    ) {
        this.form = this.fb.group({
            description: ['', Validators.required],
            total_value: ['', Validators.required],
            purchase_date: ['', Validators.required],
            payment_type: [null as 'CARTAO' | 'PIX' | 'DINHEIRO' | 'FIADO' | null, Validators.required],
            card: [null],
            subcategory: ['', Validators.required],
            installments_quantity: [1, [Validators.required, Validators.min(1)]]
        });
    }

    ngOnInit() {
        this.cardsService.getCards().subscribe(res => {
            this.cards = res;

            if (this.expense) {
                const formattedValue = new Intl.NumberFormat('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }).format(this.expense.total_value);
                
                this.form.patchValue({
                    description: this.expense.description,
                    total_value: formattedValue,
                    purchase_date: this.expense.purchase_date,
                    payment_type: this.expense.payment_type,
                    card: this.expense.card?.id ?? null,
                    subcategory: this.expense.subcategory?.id ?? null,
                    installments_quantity: this.expense.installments_quantity
                });
            }
        });

        this.form.get('payment_type')!.valueChanges.subscribe(value => {
            if (value !== 'CARTAO') {
                this.form.get('card')!.setValue(null);
            }
        });

    }

    formatValue() {
        const ctrl = this.form.get('total_value');
        const v = ctrl?.value;

        if (!v) return;

        const digits = v.replace(/\D/g, '');

        if (!digits) {
            ctrl?.setValue('', { emitEvent: false });
            return;
        }

        const number = Number(digits) / 100;

        const formatted = new Intl.NumberFormat('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(number);

        ctrl?.setValue(formatted, { emitEvent: false });
    }


    submit() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const payload = { ...this.form.value,
            total_value: Number(
                this.form.value.total_value!.replace(/\./g, '').replace(',', '.')
            )
        };

        const request$ = this.expense
            ? this.service.updateExpense(this.expense.id, payload)
            : this.service.createExpense(payload);

        request$.subscribe(() => {
            this.saved.emit();

            this.form.reset({
                payment_type: null,
                installments_quantity: 1
            });
        });
    }

    close() {
        this.cancel.emit();
    }
}
