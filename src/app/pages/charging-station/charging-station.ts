import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
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
  chargePoints: any[];
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
  loading = false;
  error = '';

 // private apiUrl = 'https://localhost:7227/api/ChargingStation';
  private apiUrl = 'http://cms.kwikevcharging.in/api/ChargingStation';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef   // ✅ injected
  ) {}

  ngOnInit(): void {
    this.fetchStations();
  }

  fetchStations(): void {
    this.loading = true;
    this.error = '';
    this.cdr.detectChanges(); // ✅ update UI immediately

    this.http.get<ChargingStation[]>(this.apiUrl)
      .pipe(finalize(() => {
        this.loading = false;
        this.cdr.detectChanges(); // ✅ reflect loading=false
      }))
      .subscribe({
        next: (res) => {
          this.stations = res || [];
          this.cdr.detectChanges(); // ✅ update list
        },
        error: () => {
          this.error = 'Failed to load charging stations';
          this.cdr.detectChanges(); // ✅ show error
        }
      });
  }

  addStation(): void {
    this.router.navigate(['/dashboard/add-station']);
  }

  // viewStation(stationId: number): void {
  //   this.router.navigate(['/stations','connectors', stationId ]);
  // }
  viewStation(stationId: number): void {
  this.router.navigate([
    '/dashboard/charging-station/connectors',
    stationId
  ]);
}


  getGoogleMapsUrl(lat: number, lng: number): string {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  }
}


