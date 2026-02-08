import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class Login {
  form;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toast: ToastrService
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  submit() {
    if (this.form.invalid) {
      this.toast.warning('Informe usuário e senha');
      return;
    }

    this.auth.login(this.form.value as any).subscribe({
      next: () => {
        this.toast.success('Login realizado com sucesso');
        this.router.navigate(['/']);
      },
      error: () => {
        this.toast.error('Usuário ou senha inválidos');
      }
    });
  }
}
