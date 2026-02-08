import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, Validators, FormControl, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { take } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss']
})
export class Profile implements OnInit {
  form!: FormGroup<{
    salario_bruto: FormControl<string | null>;
    tipo_vinculo: FormControl<string | null>;
  }>;

  message = '';
  loading = true;
  saving = false;

  inss: number | null = null;
  salario_liquido: number | null = null;
  limite_mensal: number | null = null;

  private api = 'http://localhost:8000/api/profile/';

  constructor(
    private http: HttpClient,
    private cd: ChangeDetectorRef,
    private toastr: ToastrService
  ) {
    this.form = new FormGroup({
      salario_bruto: new FormControl<string | null>(null, {
        validators: [Validators.required]
      }),
      tipo_vinculo: new FormControl<string | null>(null, {
        validators: [Validators.required]
      }),
    });
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;

    this.inss = null;
    this.salario_liquido = null;
    this.limite_mensal = null;

    this.cd.detectChanges();

    this.http.get<any>(this.api).pipe(take(1)).subscribe({
      next: data => {
        this.form.reset(
          {
            salario_bruto: data.salario_bruto != null
              ? new Intl.NumberFormat('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                }).format(data.salario_bruto)
              : null,
            tipo_vinculo: data.tipo_vinculo ?? null,
          },
          { emitEvent: false }
        );

        this.inss = data.inss ?? null;
        this.salario_liquido = data.salario_liquido ?? null;
        this.limite_mensal = data.limite_mensal ?? null;

        this.loading = false;
        this.cd.detectChanges();
      },
      error: err => {
        console.log('ERRO PROFILE:', err);
        this.loading = false;
        this.toastr.error('Erro ao carregar perfil');
        this.cd.detectChanges();
      }
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastr.warning('Preencha todos os campos obrigatórios');
      return;
    }

    const salarioStr = this.form.value.salario_bruto;
    if (!salarioStr) return;

    const salario = Number(
      salarioStr.replace(/\./g, '').replace(',', '.')
    );

    const payload = {
      ...this.form.value,
      salario_bruto: salario
    };

    this.saving = true;

    this.http.put<any>(this.api, payload).pipe(take(1)).subscribe({
      next: data => {
        this.inss = data.inss ?? null;
        this.salario_liquido = data.salario_liquido ?? null;
        this.limite_mensal = data.limite_mensal ?? null;

        this.saving = false;
        this.toastr.success('Perfil salvo com sucesso');
        this.cd.detectChanges();
      },
      error: err => {
        console.log('ERRO SAVE:', err);
        this.saving = false;
        this.toastr.error('Erro ao salvar perfil');
        this.cd.detectChanges();
      }
    });
  }

  formatBRL(v: number | null): string {
    if (v == null) return '-';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(v);
  }

  formatSalario() {
    const ctrl = this.form.controls.salario_bruto;
    const v = ctrl.value;

    if (!v) return;

    const normalizado = v.replace(/\./g, '').replace(',', '.');
    const n = Number(normalizado);
    if (isNaN(n)) return;

    const formatado = new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(n);

    ctrl.setValue(formatado, { emitEvent: false });
  }
}