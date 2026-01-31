import { Component } from '@angular/core';
import { ReactiveFormsModule , FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth';

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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
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
  
  passwordMatch(group: any) {
    return group.get('password')?.value === group.get('confirmPassword')?.value
      ? null
      : { passwordMismatch: true };
  }

  submit() {
    if (this.form.invalid) return;

    this.authService.register(this.form.value).subscribe({
      next: () => this.router.navigate(['/login']),
      error: err => alert(err.error?.message || 'Erro ao registrar')
    });
  }
}
