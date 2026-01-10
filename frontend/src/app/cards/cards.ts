import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardsService } from './cards.service';

@Component({
  standalone: true,
  selector: 'app-cards',
  templateUrl: './cards.html',
  styleUrls: ['./cards.scss'],
  imports: [CommonModule]
})
export class Cards {
  cards: any[] = [];
  loading = true;

  constructor(private service: CardsService) {
    this.loadCards();
  }

  loadCards() {
    this.service.getCards().subscribe(res => {
      this.cards = res;
      this.loading = false;
    });
  }
}
