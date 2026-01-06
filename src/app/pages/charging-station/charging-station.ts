// import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { HttpClient, HttpClientModule } from '@angular/common/http';
// import { finalize } from 'rxjs/operators';

// interface ChargingStation {
//   id: number;
//   name: string;
//   latitude: number;
//   longitude: number;
//   address: string;
//   type: string;
//   isAvailable: boolean;
//   distance: number;
// }

// @Component({
//   selector: 'app-charging-station',
//   standalone: true,
//   imports: [CommonModule, HttpClientModule],
//   templateUrl: './charging-station.html',
//   styleUrl: './charging-station.scss',
// })
// export class ChargingStationComponent implements OnInit {

//   stations: ChargingStation[] = [];
//   loading = false;
//   error = '';

//   private apiUrl = 'https://localhost:7227/api/ChargingStation';

//   constructor(
//     private http: HttpClient,
//     private cdr: ChangeDetectorRef // ✅ IMPORTANT
//   ) {}

//   ngOnInit(): void {
//     console.log('Component initialized');
//     this.fetchStations();
//   }

//   fetchStations() {
//     this.loading = true;
//     console.log('Loading started:', this.loading);

//     this.http.get<ChargingStation[]>(this.apiUrl)
//       .pipe(
//         finalize(() => {
//           this.loading = false;
//           console.log('Loading finished:', this.loading);
//           this.cdr.detectChanges(); // ✅ FORCE UI UPDATE
//         })
//       )
//       .subscribe({
//         next: (res) => {
//           console.log('API Response:', res);
//           this.stations = res;
//         },
//         error: (err) => {
//           console.error('API Error:', err);
//           this.error = 'Failed to load charging stations';
//         }
//       });
//   }
// }




import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

interface ChargingStation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  type: string;
  isAvailable: boolean;
  distance: number;
}

@Component({
  selector: 'app-charging-station',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './charging-station.html',
  styleUrl: './charging-station.scss',
})
export class ChargingStationComponent implements OnInit {

  stations: ChargingStation[] = [];
  loading: boolean = false;
  error: string = '';

  private apiUrl = 'https://localhost:7227/api/ChargingStation';

  constructor(private http: HttpClient,
        private cdr: ChangeDetectorRef   // ✅ IMPORTANT

  ) {}

  ngOnInit(): void {
    this.fetchStations();
  }

  fetchStations(): void {
    this.loading = true;
    this.error = '';

    this.http.get<ChargingStation[]>(this.apiUrl)
      .pipe(
        finalize(() => {
          this.loading = false;
       this.cdr.detectChanges();   // ✅ FORCE UI UPDATE

        })
      )
      .subscribe({
        next: (response) => {

          this.stations = response || [];
            console.log('After assign:', this.stations);

        },
        error: (err) => {
          console.error('API Error:', err);
          this.error = 'Failed to load charging stations';
        }
      });
  }

  getGoogleMapsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

}
