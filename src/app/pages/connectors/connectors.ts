// import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { HttpClient, HttpClientModule } from '@angular/common/http';
// import { ActivatedRoute } from '@angular/router';

// @Component({
//   selector: 'app-connectors',
//   standalone: true,
//   imports: [CommonModule, HttpClientModule],
//   templateUrl: './connectors.html',
//   styleUrl: './connectors.scss'
// })
// export class ConnectorsComponent implements OnInit {

//   stationId!: number;
//   loading = false;
//   error = '';

//   station: any = null;
//   connectors: any[] = [];

//   private apiUrl = 'https://localhost:7227/api/ChargingStation';

//   constructor(
//     private route: ActivatedRoute,
//     private http: HttpClient,
//     private cdr: ChangeDetectorRef   // ✅ added
//   ) {}

//   ngOnInit(): void {
//     this.stationId = Number(this.route.snapshot.paramMap.get('stationId'));
//     this.fetchStationDetails();
//   }

//   fetchStationDetails(): void {
//     this.loading = true;
//     this.error = '';
//     this.cdr.detectChanges(); // ✅ reflect loading immediately

//     this.http.get<any>(`${this.apiUrl}/${this.stationId}`)
//       .subscribe({
//         next: (res) => {
//           this.station = res;

//           // flatten all connectors from charge points
//           this.connectors = res.chargePoints.flatMap(
//             (cp: any) => cp.connectors.map((c: any) => ({
//               ...c,
//               chargePointId: cp.id
//             }))
//           );

//           this.loading = false;
//           this.cdr.detectChanges(); // ✅ update UI after data load
//         },
//         error: () => {
//           this.error = 'Failed to load connectors';
//           this.loading = false;
//           this.cdr.detectChanges(); // ✅ show error
//         }
//       });
//   }
// }













//add connector   
// import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { HttpClient, HttpClientModule } from '@angular/common/http';
// import { ActivatedRoute } from '@angular/router';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-connectors',
//   standalone: true,
//   imports: [CommonModule, HttpClientModule, FormsModule],
//   templateUrl: './connectors.html',
//   styleUrl: './connectors.scss'
// })
// export class ConnectorsComponent implements OnInit {

//   stationId!: number;
//   loading = false;
//   error = '';

//   station: any = null;
//   chargePoints: any[] = [];

//   /* ===== ADD CHARGE POINT ===== */
//   showAddChargePointModal = false;

//   newChargePoint = {
//     id: '',
//     vendor: '',
//     model: '',
//     serialNumber: ''
//   };

//   /* ===== ADD CONNECTOR ===== */
//   showAddConnectorModal = false;
//   selectedChargePointId = '';

//   newConnector = {
//     connectorId: 0,
//     type: '',
//     powerRating: 0
//   };

//   private apiUrl = 'https://localhost:7227/api/ChargingStation';

//   constructor(
//     private route: ActivatedRoute,
//     private http: HttpClient,
//     private cdr: ChangeDetectorRef
//   ) {}

//   ngOnInit(): void {
//     this.stationId = Number(this.route.snapshot.paramMap.get('stationId'));
//     this.fetchStationDetails();
//   }

//   fetchStationDetails(): void {
//     this.loading = true;
//     this.cdr.detectChanges();

//     this.http.get<any>(`${this.apiUrl}/${this.stationId}`).subscribe({
//       next: (res) => {
//         this.station = res;
//         this.chargePoints = res.chargePoints.map((cp: any) => ({
//           ...cp,
//           expanded: false
//         }));
//         this.loading = false;
//         this.cdr.detectChanges();
//       },
//       error: () => {
//         this.error = 'Failed to load charging points';
//         this.loading = false;
//         this.cdr.detectChanges();
//       }
//     });
//   }

//   toggleConnectors(cp: any): void {
//     cp.expanded = !cp.expanded;
//     this.cdr.detectChanges();
//   }

//   /* ================= ADD CHARGE POINT ================= */

//   openAddChargePointModal(): void {
//     this.showAddChargePointModal = true;
//     this.cdr.detectChanges();
//   }

//   closeAddChargePointModal(): void {
//     this.showAddChargePointModal = false;
//     this.resetChargePointForm();
//     this.cdr.detectChanges();
//   }

//   resetChargePointForm(): void {
//     this.newChargePoint = {
//       id: '',
//       vendor: '',
//       model: '',
//       serialNumber: ''
//     };
//   }

//   addChargePoint(): void {
//     const url = `${this.apiUrl}/${this.stationId}/charge-points`;

//     this.loading = true;
//     this.cdr.detectChanges();

//     this.http.post(url, this.newChargePoint).subscribe({
//       next: () => {
//       this.showAddChargePointModal = false;

//         this.closeAddChargePointModal();
//         this.fetchStationDetails();
//       },
//       error: () => {
//         this.loading = false;
//         alert('Failed to add charge point');
//         this.cdr.detectChanges();
//       }
//     });
//   }

//   /* ================= ADD CONNECTOR ================= */

//   openAddConnectorModal(chargePointId: string): void {
//     this.selectedChargePointId = chargePointId;
//     this.showAddConnectorModal = true;
//     this.cdr.detectChanges();
//   }

//   closeAddConnectorModal(): void {
//     this.showAddConnectorModal = false;
//     this.resetConnectorForm();
//     this.cdr.detectChanges();
//   }

//   resetConnectorForm(): void {
//     this.newConnector = {
//       connectorId: 0,
//       type: '',
//       powerRating: 0
//     };
//   }

//   addConnector(): void {
//     const url =
//       `${this.apiUrl}/charge-points/${this.selectedChargePointId}/connectors`;

//     this.loading = true;
//     this.cdr.detectChanges();

//     this.http.post(url, this.newConnector).subscribe({
//       next: () => {
//               this.showAddConnectorModal = false;

//         this.closeAddConnectorModal();
//         this.fetchStationDetails();
//       },
//       error: () => {
//         this.loading = false;
//         alert('Failed to add connector');
//         this.cdr.detectChanges();
//       }
//     });
//   }
// }



//url modal based 
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-connectors',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './connectors.html',
  styleUrl: './connectors.scss'
})
export class ConnectorsComponent implements OnInit {

  stationId!: number;
  loading = false;
  error = '';

  station: any = null;
  chargePoints: any[] = [];

  /* ===== ADD CHARGE POINT ===== */
  showAddChargePointModal = false;

  newChargePoint = {
    id: '',
    vendor: '',
    model: '',
    serialNumber: ''
  };

  /* ===== ADD CONNECTOR ===== */
  showAddConnectorModal = false;
  selectedChargePointId = '';

  newConnector = {
    connectorId: 0,
    type: '',
    powerRating: 0
  };

  private apiUrl = 'https://localhost:7227/api/ChargingStation';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.stationId = Number(this.route.snapshot.paramMap.get('stationId'));
    this.fetchStationDetails();

    // Listen to query params to open modals
    this.route.queryParams.subscribe(params => {
      const modal = params['modal'];
      const id = params['id'];

      if(modal === 'chargePoint') {
        this.openAddChargePointModal(false); // don't push new URL
      } 
      else if(modal === 'connector' && id) {
        this.openAddConnectorModal(id, false);
      } 
      else {
        this.closeAddChargePointModal(false);
        this.closeAddConnectorModal(false);
      }
    });
  }

  /* ================== Fetching ================== */
  fetchStationDetails(): void {
    this.loading = true;
    this.cdr.detectChanges();

    this.http.get<any>(`${this.apiUrl}/${this.stationId}`).subscribe({
      next: (res) => {
        this.station = res;
        this.chargePoints = res.chargePoints.map((cp: any) => ({
          ...cp,
          expanded: false
        }));
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Failed to load charging points';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  toggleConnectors(cp: any): void {
    cp.expanded = !cp.expanded;
    this.cdr.detectChanges();
  }

  /* ================= ADD CHARGE POINT ================= */
  openAddChargePointModal(pushUrl = true): void {
    this.showAddChargePointModal = true;
    this.cdr.detectChanges();
    if(pushUrl) {
      this.router.navigate([], { queryParams: { modal: 'chargePoint' } });
    }
  }

  closeAddChargePointModal(pushUrl = true): void {
    this.showAddChargePointModal = false;
    this.resetChargePointForm();
    this.cdr.detectChanges();
    if(pushUrl) {
      this.router.navigate([], { queryParams: {} });
    }
  }

  resetChargePointForm(): void {
    this.newChargePoint = {
      id: '',
      vendor: '',
      model: '',
      serialNumber: ''
    };
  }

  addChargePoint(): void {
    const url = `${this.apiUrl}/${this.stationId}/charge-points`;

    this.loading = true;
    this.cdr.detectChanges();

    this.http.post(url, this.newChargePoint).subscribe({
      next: () => {
        this.closeAddChargePointModal();
        this.fetchStationDetails();
      },
      error: () => {
        this.loading = false;
        alert('Failed to add charge point');
        this.cdr.detectChanges();
      }
    });
  }

  /* ================= ADD CONNECTOR ================= */
  openAddConnectorModal(chargePointId: string, pushUrl = true): void {
    this.selectedChargePointId = chargePointId;
    this.showAddConnectorModal = true;
    this.cdr.detectChanges();
    if(pushUrl) {
      this.router.navigate([], { queryParams: { modal: 'connector', id: chargePointId } });
    }
  }

  closeAddConnectorModal(pushUrl = true): void {
    this.showAddConnectorModal = false;
    this.resetConnectorForm();
    this.cdr.detectChanges();
    if(pushUrl) {
      this.router.navigate([], { queryParams: {} });
    }
  }

  resetConnectorForm(): void {
    this.newConnector = {
      connectorId: 0,
      type: '',
      powerRating: 0
    };
  }

  addConnector(): void {
    const url = `${this.apiUrl}/charge-points/${this.selectedChargePointId}/connectors`;

    this.loading = true;
    this.cdr.detectChanges();

    this.http.post(url, this.newConnector).subscribe({
      next: () => {
        this.closeAddConnectorModal();
        this.fetchStationDetails();
      },
      error: () => {
        this.loading = false;
        alert('Failed to add connector');
        this.cdr.detectChanges();
      }
    });
  }
}

