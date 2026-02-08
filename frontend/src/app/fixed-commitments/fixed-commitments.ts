import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  standalone: true,
  selector: 'app-fixed-commitments',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './fixed-commitments.html',
  styleUrls: ['./fixed-commitments.scss']
})

export class FixedCommitments implements OnInit {
  commitments: any[] = [];
  private api = 'http://127.0.0.1:8000/api/fixed-commitments/';

  constructor(
    private toastr: ToastrService,
    private http: HttpClient,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.load();
  }

  load() {
    this.http.get<any[]>(this.api).subscribe(data => {
      this.commitments = data;
      this.cd.detectChanges();
    });
  }

  toggle(item: any) {
    this.http.patch(`${this.api}${item.id}/`, {
      active: !item.active
    }).subscribe({
      next: () => {
        this.toastr.success(
          item.active ? 'Compromisso desativado' : 'Compromisso ativado'
        );
        this.load();
      },
      error: () => {
        this.toastr.error('Erro ao atualizar compromisso');
      }
    });
  }

}

