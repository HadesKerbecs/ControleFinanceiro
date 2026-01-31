import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class Login {
  form;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
  this.form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });
  }

  submit() {
    if (this.form.invalid) return;

    this.auth.login(this.form.value as any)
      .subscribe(() => this.router.navigate(['/']));
  }
}
