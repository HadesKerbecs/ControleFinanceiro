import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { CardsService } from '../cards.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  standalone: true,
  selector: 'app-card-form',
  templateUrl: './card-form.html',
  styleUrls: ['./card-form.scss'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class CardForm implements OnInit {
  @Output() saved = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Input() card: any;

  form;

  constructor(
    private fb: FormBuilder,
    private service: CardsService,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group(
      {
        bank_name: ['', Validators.required],
        brand: ['', Validators.required],
        last_four_digits: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
        limit: ['', Validators.required],
        closing_day: ['', Validators.required],
        due_day: ['', Validators.required],
        expiration_month: ['', [Validators.required, Validators.min(1), Validators.max(12)]],
        expiration_year: ['', [Validators.required, Validators.min(this.currentYear())]]
      },
      { validators: this.expirationValidator }
    );
  }

  ngOnInit(): void {
    if (this.card) {
      const formattedLimit = new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(this.card.limit);

      this.form.patchValue({
        ...this.card,
        limit: formattedLimit
      });
    }
  }

  currentYear(): number {
    return new Date().getFullYear() % 100;
  }

  expirationValidator(control: AbstractControl): ValidationErrors | null {
    const month = control.get('expiration_month')?.value;
    const year = control.get('expiration_year')?.value;

    if (!month || !year) return null;

    const now = new Date();
    const expDate = new Date(2000 + year, month, 0);

    return now > expDate ? { expired: true } : null;
  }

  formatLimit() {
    const ctrl = this.form.get('limit');
    if (!ctrl) return;

    const v = ctrl.value as string;
    if (!v) return;

    const digits = v.replace(/\D/g, '');
    if (!digits) {
      ctrl.setValue('', { emitEvent: false });
      return;
    }

    const number = Number(digits) / 100;

    ctrl.setValue(
      new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(number),
      { emitEvent: false }
    );
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastr.warning('Preencha todos os campos corretamente');
      return;
    }

    const payload = {
      ...this.form.value,
      limit: Number(
        this.form.value.limit!.replace(/\./g, '').replace(',', '.')
      )
    };

    const request$ = this.card
      ? this.service.updateCard(this.card.id, payload)
      : this.service.createCard(payload);

    request$.subscribe({
      next: () => {
        this.toastr.success(
          this.card ? 'Cartão atualizado com sucesso' : 'Cartão cadastrado com sucesso'
        );
        this.saved.emit();
        this.form.reset();
      },
      error: () => {
        this.toastr.error('Erro ao salvar cartão');
      }
    });
  }

  close() {
    this.cancel.emit();
  }
}
