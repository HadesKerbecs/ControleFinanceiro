import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrl: './register.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class Register {
  form!: FormGroup;
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group(
      {
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatch }
    );
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  passwordMatch(group: any) {
    return group.get('password')?.value === group.get('confirmPassword')?.value
      ? null
      : { passwordMismatch: true };
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastr.warning('Preencha todos os campos corretamente');
      return;
    }

    this.authService.register(this.form.value).subscribe({
      next: () => {
        this.toastr.success('Cadastro realizado com sucesso');
        this.router.navigate(['/login']);
      },
      error: err => {
        this.toastr.error(
          err.error?.message || 'Erro ao registrar usuário'
        );
      }
    });
  }
}
