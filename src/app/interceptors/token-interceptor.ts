// import { HttpInterceptorFn } from '@angular/common/http';
// import { inject } from '@angular/core';
// import { AuthService } from '../services/auth';

// export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
//   const authService = inject(AuthService);
//   const token = authService.getToken();

//   if (token) {
//     req = req.clone({
//       setHeaders: {
//         Authorization: `Bearer ${token}`
//       }
//     });
//   }

//   return next(req);
// };




// import { HttpInterceptorFn } from '@angular/common/http';
// import { inject } from '@angular/core';
// import { AuthService } from '../services/auth';
// import { catchError, switchMap, throwError } from 'rxjs';

// let isRefreshing = false;

// export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
//   const authService = inject(AuthService);
//   const token = authService.getToken();

//   let authReq = req;

//   if (token) {
//     authReq = req.clone({
//       setHeaders: {
//         Authorization: `Bearer ${token}`
//       }
//     });
//   }

//   return next(authReq).pipe(
//     catchError(error => {
//       if (error.status === 401 && !isRefreshing) {
//         isRefreshing = true;

//         return authService.refreshToken().pipe(
//           switchMap(res => {
//             isRefreshing = false;

//             const newReq = req.clone({
//               setHeaders: {
//                 Authorization: `Bearer ${res.accessToken}`
//               }
//             });

//             return next(newReq);
//           }),
//           catchError(refreshError => {
//             isRefreshing = false;
//             authService.logout();
//             return throwError(() => refreshError);
//           })
//         );
//       }

//       return throwError(() => error);
//     })
//   );
// };





import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';
import {
  catchError,
  switchMap,
  filter,
  take,
  finalize
} from 'rxjs/operators';

import { BehaviorSubject, Observable, throwError } from 'rxjs';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  console.log(
    `%c[Interceptor] Request → ${req.method} ${req.url}`,
    'color: #2196f3'
  );

  // 🔹 Skip refresh endpoint itself
  // if (req.url.includes('/api/admin/auth/refresh')) {
  //   console.log('[Interceptor] Skipping refresh endpoint');
  //   return next(req);
  // }
// 🔹 Skip auth endpoints (login + refresh)
// if (
//   req.url.includes('/api/admin/auth/login') ||
//   req.url.includes('/api/admin/auth/refresh')
// ) {
//   console.log('[Interceptor] Skipping auth endpoint');
//   return next(req);
// }

  const token = authService.getToken();
  console.log(
    `[Interceptor] Access token: ${token ? 'PRESENT' : 'MISSING'}`
  );

  const authReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error(
        `[Interceptor] HTTP ERROR ${error.status} on ${req.url}`
      );

      if (error.status === 401) {
        console.warn('[Interceptor] 401 detected → handling refresh');
        return handle401Error(req, next, authService);
      }

      return throwError(() => error);
    })
  );
};

function handle401Error(
  req: any,
  next: any,
  authService: AuthService
): Observable<any> {
  if (!isRefreshing) {
    console.log('[Interceptor] Starting refresh token flow');

    isRefreshing = true;
    refreshTokenSubject.next(null);

    return authService.refreshToken().pipe(
      switchMap(res => {
        console.log('[Interceptor] Refresh token SUCCESS');

        isRefreshing = false;
        refreshTokenSubject.next(res.data.accessToken);

        const retryReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${res.data.accessToken}`
          }
        });

        console.log(
          `%c[Interceptor] Retrying → ${req.url}`,
          'color: green'
        );

        return next(retryReq);
      }),
      catchError(err => {
        console.error('[Interceptor] Refresh token FAILED', err);
        isRefreshing = false;

        authService.logout();
        return throwError(() => err);
      }),
      finalize(() => {
        console.log('[Interceptor] Refresh flow finalized');
      })
    );
  }

  console.log('[Interceptor] Waiting for ongoing refresh');

  return refreshTokenSubject.pipe(
    filter(token => token !== null),
    take(1),
    switchMap(token => {
      console.log(
        `%c[Interceptor] Retrying queued request → ${req.url}`,
        'color: orange'
      );

      const retryReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });

      return next(retryReq);
    })
  );
}
