import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CardsService } from '../cards.service';

@Component({
  standalone: true,
  selector: 'app-card-form',
  templateUrl: './card-form.html',
  styleUrls: ['./card-form.scss'],
  imports: [ReactiveFormsModule]
})
export class CardForm {
  form;

  constructor(
    private fb: FormBuilder,
    private service: CardsService
  ) {
    this.form = this.fb.group({
      bank_name: [''],
      brand: [''],
      limit: [''],
      closing_day: [''],
      due_day: [''],
      color: ['']
    });
  }

  submit() {
    this.service.createCard(this.form.value).subscribe();
  }
}
