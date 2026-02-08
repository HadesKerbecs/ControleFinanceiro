import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardsService } from './cards.service';
import { Router } from '@angular/router';
import { CardForm } from './card-form/card-form';
import { ToastrService } from 'ngx-toastr';

@Component({
  standalone: true,
  selector: 'app-cards',
  templateUrl: './cards.html',
  styleUrls: ['./cards.scss'],
  imports: [CommonModule, CardForm]
})
export class Cards implements OnInit {
  selectedCard: any = null;
  cards: any[] = [];
  loading = true;
  showForm = false;
  confirmDelete = false;
  cardToDelete: any = null;

  constructor(
    private service: CardsService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadCards();
  }

  loadCards() {
    this.loading = true;

    this.service.getCards().subscribe({
      next: res => {
        this.cards = res;
        this.loading = false;
        this.cd.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.toastr.error('Erro ao carregar cartões');
      }
    });
  }

  openForm() {
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.loadCards();
  }

  getCardColor(bank: string): string {
    if (!bank) return '#334155';

    const map: Record<string, string> = {
      'banco do brasil': '#facc15',
      'nubank': '#6d28d9',
      'itaú': '#f97316',
      'itau': '#f97316',
      'bradesco': '#dc2626',
      'santander': '#b91c1c',
      'caixa': '#2563eb',
      'inter': '#f97316',
      'next': '#16a34a'
    };

    return map[bank.toLowerCase()] || '#334155';
  }

  isCardExpired(card: any): boolean {
    if (!card.expiration_month || !card.expiration_year) return false;

    const now = new Date();

    const fullYear = 2000 + Number(card.expiration_year);
    const month = Number(card.expiration_month);

    const expirationDate = new Date(
      fullYear,
      month,
      0,
      23,
      59,
      59
    );

    return now > expirationDate;
  }

  isCardExpiringSoon(card: any): boolean {
    if (!card.expiration_month || !card.expiration_year) return false;

    if (this.isCardExpired(card)) return false;

    const now = new Date();

    const fullYear = 2000 + Number(card.expiration_year);
    const month = Number(card.expiration_month);

    const expirationDate = new Date(fullYear, month, 0, 23, 59, 59);

    const diffMonths =
      (expirationDate.getFullYear() - now.getFullYear()) * 12 +
      (expirationDate.getMonth() - now.getMonth());

    return diffMonths <= 3;
  }

  editCard(card: any) {
    if (this.isCardExpired(card)) {
      this.toastr.warning('Este cartão está vencido e não pode ser editado');
      return;
    }

    this.selectedCard = card;
    this.showForm = true;
  }

  deleteCard(card: any) {
    this.cardToDelete = card;
    this.confirmDelete = true;
  }
  
  cancelDelete() {
    this.confirmDelete = false;
    this.cardToDelete = null;
  }

  confirmDeleteCard() {
    if (!this.cardToDelete) return;

    const id = this.cardToDelete.id;

    this.service.deleteCard(id).subscribe({
      next: () => {
        this.toastr.success('Cartão removido com sucesso');
        this.confirmDelete = false;
        this.cardToDelete = null;
        this.loadCards();
      },
      error: () => {
        this.toastr.error('Erro ao remover cartão');
      }
    });
  }

  canEditCard(card: any): boolean {
    return !this.isCardExpired(card);
  }

  getUsagePercent(card: any): number {
    if (!card.limit || card.limit === 0) return 0;
    return Math.min((card.total_spent / card.limit) * 100, 100);
  }
}
