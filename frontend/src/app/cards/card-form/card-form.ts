import { Component, EventEmitter, Output, Input } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CardsService } from '../cards.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-card-form',
  templateUrl: './card-form.html',
  styleUrls: ['./card-form.scss'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class CardForm {
  @Output() saved = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Input() card: any;

  form;

  constructor(
    private fb: FormBuilder,
    private service: CardsService
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

  ngOnInit() {
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
    return new Date().getFullYear() % 100; // YY
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

    const formatted = new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(number);

    ctrl.setValue(formatted, { emitEvent: false });
  }

  submit() {
    if (this.form.invalid) return;

    if (this.card) {
      this.service.updateCard(this.card.id, this.form.value)
        .subscribe(() => {
          this.saved.emit();
          this.form.reset();
        });
    } else {
      this.service.createCard(this.form.value)
        .subscribe(() => {
          this.saved.emit();
          this.form.reset();
        });
    }
  }

  close() {
    this.cancel.emit();
  }

}
