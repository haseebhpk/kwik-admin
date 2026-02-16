import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

interface AdminLoginDto {
  adminUsername: string;
  password: string;
}

interface AdminLoginResponseDto {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiry: string;
}


export interface RefreshTokenResponseDto {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiry: string;
  };
  message: string;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = 'https://localhost:7227/api/admin/auth/login';
  private refreshUrl = 'https://localhost:7227/api/admin/auth/refresh';

  constructor(private http: HttpClient, private router: Router) {}

  login(data: AdminLoginDto): Observable<AdminLoginResponseDto> {
    return this.http.post<AdminLoginResponseDto>(this.loginUrl, data).pipe(
     
     tap((res: any) => {
  localStorage.setItem('accessToken', res.data.accessToken);
  localStorage.setItem('refreshToken', res.data.refreshToken);
})

     
     
      );
  }


  refreshToken(): Observable<RefreshTokenResponseDto> {
  const refreshToken = localStorage.getItem('refreshToken');

  return this.http.post<RefreshTokenResponseDto>(this.refreshUrl, {
    refreshToken
  }).pipe(
    tap(res => {
      // ✅ CORRECT PATH
      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);
    })
  );
}


  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }
}
