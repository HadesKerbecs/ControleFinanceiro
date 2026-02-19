import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CategoriesService } from '../../categories/categories.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-fixed-commitment-form',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './fixed-commitment-form.html',
  styleUrls: ['./fixed-commitment-form.scss']
})
export class FixedCommitmentForm implements OnInit {
  isEdit = false;
  commitmentId!: number;

  categories: any[] = [];
  private api = 'https://controlefinanceiro-pgsn.onrender.com/api/fixed-commitments/';

  form = new FormGroup({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    value: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    category: new FormControl<number | null>(null, {
      validators: [Validators.required]
    }),
    due_day: new FormControl<number | null>(null, {
      validators: [
        Validators.required,
        Validators.min(1),
        Validators.max(31)
      ]
    }),
  });

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private categoriesService: CategoriesService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.categoriesService.getCategories().subscribe(data => {
      this.categories = data;
      this.form.controls.category.setValue(null);
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.commitmentId = Number(id);
      this.loadCommitment();
    }
  }

  private loadCommitment(): void {
    this.http.get<any>(`${this.api}${this.commitmentId}/`).subscribe({
      next: data => {
        this.form.patchValue({
          name: data.name,
          value: new Intl.NumberFormat('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(data.value),
          category: data.category,
          due_day: data.due_day
        });
      },
      error: () => {
        this.toastr.error('Erro ao carregar compromisso');
        this.router.navigate(['/fixed-commitments']);
      }
    });
  }

  private create(payload: any) {
    this.http.post(this.api, payload).subscribe({
      next: () => {
        this.toastr.success('Compromisso fixo cadastrado');
        this.router.navigate(['/fixed-commitments']);
      },
      error: () => {
        this.toastr.error('Erro ao cadastrar compromisso');
      }
    });
  }

  private update(payload: any) {
    this.http.put(`${this.api}${this.commitmentId}/`, payload).subscribe({
      next: () => {
        this.toastr.success('Compromisso atualizado');
        this.router.navigate(['/fixed-commitments']);
      },
      error: () => {
        this.toastr.error('Erro ao atualizar compromisso');
      }
    });
  }

  formatValue() {
    const ctrl = this.form.controls.value;
    const v = ctrl.value;

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

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastr.warning('Preencha todos os campos');
      return;
    }

    const name = this.form.controls.name.value.trim();
    const value = Number(
      this.form.controls.value.value.replace(/\./g, '').replace(',', '.')
    );
    const category = Number(this.form.controls.category.value);
    const due_day = Number(this.form.controls.due_day.value);

    const payload = { name, value, category, due_day };

    // 🔒 VALIDA DUPLICADO SOMENTE NO CREATE
    if (!this.isEdit) {
      this.http.get<any[]>(this.api).subscribe(existing => {
        const alreadyExists = existing.some(
          c =>
            c.name.toLowerCase().trim() === name.toLowerCase() &&
            c.active === true
        );

        if (alreadyExists) {
          this.toastr.warning(
            'Já existe um compromisso ativo com esse nome. Edite o existente.'
          );
          return;
        }

        this.create(payload);
      });

      return;
    }

    // ✏️ EDITAR
    this.update(payload);
  }

  cancel() {
    this.router.navigate(['/fixed-commitments']);
  }
}
