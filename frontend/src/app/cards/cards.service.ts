import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class CardsService {
  private api = 'http://127.0.0.1:8000/api/cards/';

  constructor(private http: HttpClient) { }

  getCards() {
    return this.http.get<any[]>(this.api);
  }

  createCard(data: any) {
    return this.http.post(this.api, data);
  }
  
  updateCard(id: number, data: any) {
    return this.http.put(`${this.api}${id}/`, data);
  }

  deleteCard(id: number) {
    return this.http.delete(`${this.api}${id}/`);
  }
}
