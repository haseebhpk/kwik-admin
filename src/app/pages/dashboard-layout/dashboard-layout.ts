// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-dashboard-layout',
//   imports: [],
//   templateUrl: './dashboard-layout.html',
//   styleUrl: './dashboard-layout.scss',
// })
// export class DashboardLayout {

// }




import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.scss',
})
export class DashboardLayoutComponent {}
