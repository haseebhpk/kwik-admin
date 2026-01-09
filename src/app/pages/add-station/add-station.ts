// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { HttpClient, HttpClientModule } from '@angular/common/http';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-add-station',
//   standalone: true,
//   imports: [CommonModule, FormsModule, HttpClientModule],
//   templateUrl: './add-station.html',
//   styleUrl: './add-station.scss',
// })
// export class AddStationComponent {

//   station = {
//     name: '',
//     latitude: 0,
//     longitude: 0,
//     address: '',
//     type: ''
//   };

//   private apiUrl = 'https://localhost:7227/api/ChargingStation';

//   constructor(
//     private http: HttpClient,
//     private router: Router
//   ) {}

//   submit(): void {
//     this.http.post(this.apiUrl, this.station).subscribe({
//       next: () => this.router.navigate(['/dashboard/charging-station']),
//       error: () => alert('Failed to add station')
//     });
//   }

//   cancel(): void {
//     this.router.navigate(['/dashboard/charging-station']);
//   }
// }





import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-station',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MatSnackBarModule
  ],
  templateUrl: './add-station.html',
  styleUrl: './add-station.scss',
})
export class AddStationComponent {

  station = {
    name: '',
    latitude: null as number | null,
    longitude: null as number | null,
    address: '',
    type: ''
  };

  private apiUrl = 'https://localhost:7227/api/ChargingStation';

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  submit(form: any): void {

    if (form.invalid) {
      return; // ❌ stop submit if frontend invalid
    }

    this.http.post(this.apiUrl, this.station).subscribe({
      next: () => {
        this.snackBar.open('✅ Station added successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-toast']
        });
        this.router.navigate(['/dashboard/charging-station']);
      },
      error: (error: HttpErrorResponse) => {
        const message =
          error.error?.message ||
          error.error ||
          'Failed to add charging station';

        this.snackBar.open(`❌ ${message}`, 'Close', {
          duration: 4000,
          panelClass: ['error-toast']
        });
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/dashboard/charging-station']);
  }
}
