import { Component, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.scss',
})
export class AdminLoginComponent {
  loginForm: FormGroup;

  showToast = false;
  toastMessage = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.loginForm = this.fb.group({
      adminUsername: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  submit() {
    if (this.loginForm.invalid) return;

    this.auth.login(this.loginForm.value).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: () => {
        this.showErrorToast('Invalid credentials');
      }
    });
  }

  private showErrorToast(message: string) {
    this.toastMessage = message;
    this.showToast = true;
    this.cdr.detectChanges(); // 🔥 force UI update

    setTimeout(() => {
      this.showToast = false;
      this.cdr.detectChanges();
    }, 3000);
  }
}
