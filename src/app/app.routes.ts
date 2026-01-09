// import { Routes } from '@angular/router';

// export const routes: Routes = [];




// import { Routes } from '@angular/router';
// import { AdminLoginComponent } from './pages/admin-login/admin-login';
// import { DashboardComponent } from './pages/dashboard/dashboard';
// import { AuthGuard } from './guards/auth-guard';

// export const routes: Routes = [
//   { path: 'login', component: AdminLoginComponent },
//   { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
//   { path: '', redirectTo: 'login', pathMatch: 'full' }
// ];



// import { Routes } from '@angular/router';
// import { AdminLoginComponent } from './pages/admin-login/admin-login';
// import { DashboardLayoutComponent } from './pages/dashboard-layout/dashboard-layout';
// import { ChargingStationComponent } from './pages/charging-station/charging-station';
// import { Gst } from './pages/gst/gst';
// import { AuthGuard } from './guards/auth-guard';
// import { AdminSummaryComponent } from './pages/admin-summary/admin-summary';
// import { EnergyComponent } from './pages/energy/energy';
// import { EditStation } from './pages/edit-station/edit-station';
// import { AddStationComponent } from './pages/add-station/add-station';

// export const routes: Routes = [
//   { path: 'login', component: AdminLoginComponent },

//   {
//     path: 'dashboard',
//     component: DashboardLayoutComponent,
//     canActivate: [AuthGuard],
//     children: [
//       { path: '', redirectTo: 'charging-station', pathMatch: 'full' },
//       { path: 'charging-station', component: ChargingStationComponent },
//       { path: 'gst', component: Gst },
//         { path: 'admin-summary', component: AdminSummaryComponent },
//         { path: 'reports/energy', component: EnergyComponent },
//         { path: 'add-station', component: AddStationComponent }

//     ]
//   },

//   { path: '', redirectTo: 'login', pathMatch: 'full' }
// ];


//

import { Routes } from '@angular/router';
import { AdminLoginComponent } from './pages/admin-login/admin-login';
import { DashboardLayoutComponent } from './pages/dashboard-layout/dashboard-layout';
import { ChargingStationComponent } from './pages/charging-station/charging-station';
import { Gst } from './pages/gst/gst';
import { AuthGuard } from './guards/auth-guard';
import { AdminSummaryComponent } from './pages/admin-summary/admin-summary';
import { EnergyComponent } from './pages/energy/energy';
import { EditStation } from './pages/edit-station/edit-station';
import { AddStationComponent } from './pages/add-station/add-station';
import { ConnectorsComponent } from './pages/connectors/connectors';

export const routes: Routes = [
  { path: 'login', component: AdminLoginComponent },

  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'charging-station', pathMatch: 'full' },

      {
        path: 'charging-station',
        children: [
          { path: '', component: ChargingStationComponent },
          { path: 'connectors/:stationId', component: ConnectorsComponent }
        ]
      },

      { path: 'gst', component: Gst },
      { path: 'admin-summary', component: AdminSummaryComponent },
      { path: 'reports/energy', component: EnergyComponent },
      { path: 'add-station', component: AddStationComponent }
    ]
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
