import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface EnergySummary {
  totalKWhUsed: number;
  totalConsumedAmount: number;
  totalSessions: number;
  totalUniqueDrivers: number;
  totalRepeatedUsers: number;
}

interface UserEnergy {
  userId: string | null;
  userName: string;
  phoneNumber: string;
  totalKWhUsed: number;
  totalConsumedAmount: number;
  lastChargedTime: string;
  totalSessions: number;
}

@Component({
  selector: 'app-energy',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './energy.html',
  styleUrls: ['./energy.scss']
})
export class EnergyComponent implements OnInit {

  private readonly baseUrl = 'https://localhost:7227/api/admin-summary';

  energyForm!: FormGroup;

  energySummary: EnergySummary | null = null;
  userEnergy: UserEnergy[] = [];

  loadingSummary = false;
  loadingUsers = false;

  noSummaryData = false;
  noUserData = false;

  errorMessage = '';
  dateError: any;
  usersLoaded: any;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    this.energyForm = this.fb.group({
      filterType: ['thisMonth', Validators.required],
      fromDate: [''],
      toDate: [''],
      timeGapInMinutes: [90, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.energyForm.valueChanges.subscribe(value => {
      console.log('[FORM CHANGE]', value);

      this.resetAllData();

      if (value.filterType !== 'custom') {
        this.energyForm.patchValue(
          { fromDate: '', toDate: '' },
          { emitEvent: false }
        );
      }

      this.cdr.detectChanges();
    });
  }

  /* ---------------- VALIDATION ---------------- */

  get isCustomInvalid(): boolean {
    const { filterType, fromDate, toDate } = this.energyForm.value;

    if (filterType !== 'custom') return false;
    if (!fromDate || !toDate) return true;

    const from = new Date(fromDate);
    const to = new Date(toDate);

    return isNaN(from.getTime()) || isNaN(to.getTime()) || from > to;
  }

  get canSubmit(): boolean {
    return this.energyForm.valid &&
      !this.isCustomInvalid &&
      !this.loadingSummary &&
      !this.loadingUsers;
  }

  /* ---------------- PAYLOAD ---------------- */

  private buildPayload() {
    const { filterType, fromDate, toDate, timeGapInMinutes } = this.energyForm.value;
    const payload: any = {
      filterType,
      timeGapInMinutes: timeGapInMinutes || 90
    };

    if (filterType === 'custom') {
      payload.fromDate = new Date(fromDate).toISOString();
      payload.toDate = new Date(toDate).toISOString();
    }

    console.log('[PAYLOAD]', payload);
    return payload;
  }

  /* ---------------- ENERGY SUMMARY ---------------- */

  loadEnergySummary(): void {
    if (!this.canSubmit) return;

    this.resetAllData();
    this.loadingSummary = true;

    const url = `${this.baseUrl}/energy-summary`;
    const payload = this.buildPayload();

    console.log('[SUMMARY] Request →', payload);
    this.cdr.detectChanges();

    this.http.post<EnergySummary>(url, payload).subscribe({
      next: (res) => {
        console.log('[SUMMARY] Response ←', res);

        if (!res || res.totalSessions === 0) {
          this.noSummaryData = true;
          this.energySummary = null;
        } else {
          this.energySummary = res;
        }

        this.loadingSummary = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('[SUMMARY] Error ←', err);
        this.loadingSummary = false;
        this.errorMessage = 'Failed to load energy summary';
        this.cdr.detectChanges();
      }
    });
  }

  /* ---------------- USERS ENERGY ---------------- */

  loadUsersEnergy(): void {
    if (!this.canSubmit) return;

    this.resetAllData();
    this.loadingUsers = true;

    const url = `${this.baseUrl}/users-energy`;
    const payload = this.buildPayload();

    console.log('[USERS] Request →', payload);
    this.cdr.detectChanges();

    this.http.post<UserEnergy[]>(url, payload).subscribe({
      next: (res) => {
        console.log('[USERS] Response ←', res);

        if (!res || res.length === 0) {
          this.noUserData = true;
          this.userEnergy = [];
        } else {
          this.userEnergy = res;
        }

        this.loadingUsers = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('[USERS] Error ←', err);
        this.loadingUsers = false;
        this.errorMessage = 'Failed to load users energy report';
        this.cdr.detectChanges();
      }
    });
  }

  /* ---------------- RESET ---------------- */

  private resetAllData(): void {
    this.energySummary = null;
    this.userEnergy = [];
    this.noSummaryData = false;
    this.noUserData = false;
    this.errorMessage = '';
  }




  private formatDate(date: Date): string {
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  private getThisMonthRange(): { start: Date; end: Date } {
    const today = new Date();

    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    return { start, end };
  }

  private getLastMonthRange(): { start: Date; end: Date } {
    const today = new Date();

    const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const end = new Date(today.getFullYear(), today.getMonth(), 0);

    return { start, end };
  }





  private getFilterDescription(): string {
    const { filterType, fromDate, toDate } = this.energyForm.value;

    if (filterType === 'thisMonth') {
      const { start, end } = this.getThisMonthRange();
      return `${this.formatDate(start)} - ${this.formatDate(end)}`;
    }

    if (filterType === 'lastMonth') {
      const { start, end } = this.getLastMonthRange();
      return `${this.formatDate(start)} - ${this.formatDate(end)}`;
    }

    if (filterType === 'custom') {
      const from = this.formatDate(new Date(fromDate));
      const to = this.formatDate(new Date(toDate));
      return `${from} - ${to}`;
    }

    return '';
  }


  downloadSummaryPDF(): void {
    if (!this.energySummary) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFillColor(41, 128, 185);
    doc.rect(0, 0, pageWidth, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Energy Summary Report', pageWidth / 2, 20, { align: 'center' });

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(this.getFilterDescription(), pageWidth / 2, 30, { align: 'center' });

    // Report info
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(9);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 48);

    // Summary data table
    const summaryData = [
      ['Total Energy Consumed', `${this.energySummary.totalKWhUsed.toFixed(2)} KWh`],
      ['Total Amount', ` ${this.energySummary.totalConsumedAmount.toFixed(2)}`],
      ['Total Charging Sessions', `${this.energySummary.totalSessions}`],
      ['Unique Drivers', `${this.energySummary.totalUniqueDrivers}`],
      ['Repeated Users', `${this.energySummary.totalRepeatedUsers}`]
    ];

    autoTable(doc, {
      startY: 55,
      head: [['Metric', 'Value']],
      body: summaryData,
      theme: 'striped',
      headStyles: {
        fillColor: [52, 152, 219],
        fontSize: 11,
        fontStyle: 'bold',
        halign: 'left'
      },
      bodyStyles: {
        fontSize: 10
      },
      columnStyles: {
        0: { cellWidth: 100, fontStyle: 'bold' },
        1: { cellWidth: 80, halign: 'right' }
      },
      margin: { left: 14, right: 14 }
    });

    // Footer
    const finalY = (doc as any).lastAutoTable.finalY || 55;
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(8);
    doc.text(
      'This is a system-generated report',
      pageWidth / 2,
      finalY + 15,
      { align: 'center' }
    );

    // Save
    const fileName = `Energy_Summary_${this.getFilenameSuffix()}.pdf`;
    doc.save(fileName);
  }

  downloadUsersPDF(): void {
    if (!this.userEnergy.length) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFillColor(46, 204, 113);
    doc.rect(0, 0, pageWidth, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Users Energy Report', pageWidth / 2, 20, { align: 'center' });

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(this.getFilterDescription(), pageWidth / 2, 30, { align: 'center' });

    // Report info
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(9);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 48);
    doc.text(`Total Users: ${this.userEnergy.length}`, pageWidth - 14, 48, { align: 'right' });

    // Users table
    const tableData = this.userEnergy.map((user, index) => [
      (index + 1).toString(),
      user.userName,
      user.phoneNumber,
      `${user.totalKWhUsed.toFixed(2)} KWh`,
      ` ${user.totalConsumedAmount.toFixed(2)}`,
      user.totalSessions.toString(),
      new Date(user.lastChargedTime).toLocaleString()
    ]);

    autoTable(doc, {
      startY: 55,
      head: [['#', 'User Name', 'Phone', 'Energy (KWh)', 'Amount', 'Sessions', 'Last Charged']],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: [39, 174, 96],
        fontSize: 9,
        fontStyle: 'bold',
        halign: 'center'
      },
      bodyStyles: {
        fontSize: 8
      },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        1: { cellWidth: 30 },
        2: { cellWidth: 28 },
        3: { cellWidth: 25, halign: 'right' },
        4: { cellWidth: 25, halign: 'right' },
        5: { cellWidth: 20, halign: 'center' },
        6: { cellWidth: 42, fontSize: 7 }
      },
      margin: { left: 14, right: 14 },
      didDrawPage: (data) => {
        // Footer on each page
        const pageCount = (doc as any).internal.getNumberOfPages();
        const currentPage = (doc as any).internal.getCurrentPageInfo().pageNumber;

        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `Page ${currentPage} of ${pageCount}`,
          pageWidth / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: 'center' }
        );
      }
    });

    // Summary at the end
    const finalY = (doc as any).lastAutoTable.finalY || 55;
    const totals = this.calculateTotals();

    if (finalY + 35 > doc.internal.pageSize.getHeight()) {
      doc.addPage();
      this.addTotalsSummary(doc, 20, totals);
    } else {
      this.addTotalsSummary(doc, finalY + 10, totals);
    }

    // Save
    const fileName = `Users_Energy_Report_${this.getFilenameSuffix()}.pdf`;
    doc.save(fileName);
  }

  private addTotalsSummary(doc: jsPDF, startY: number, totals: any): void {
    doc.setFillColor(240, 240, 240);
    doc.rect(14, startY, doc.internal.pageSize.getWidth() - 28, 25, 'F');

    doc.setTextColor(50, 50, 50);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTALS', 20, startY + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`Total Energy: ${totals.totalKWh.toFixed(2)} KWh`, 20, startY + 16);
    doc.text(`Total Amount:  ${totals.totalAmount.toFixed(2)}`, 80, startY + 16);
    // doc.text(`Average per User: ${totals.avgKWh.toFixed(2)} KWh`, 140, startY + 16);
  }

  private calculateTotals() {
    const totalKWh = this.userEnergy.reduce((sum, user) => sum + user.totalKWhUsed, 0);
    const totalAmount = this.userEnergy.reduce((sum, user) => sum + user.totalConsumedAmount, 0);
    const avgKWh = totalKWh / this.userEnergy.length;

    return { totalKWh, totalAmount, avgKWh };
  }

  private getFilenameSuffix(): string {
    const { filterType, fromDate, toDate } = this.energyForm.value;
    const date = new Date().toISOString().split('T')[0];

    if (filterType === 'custom') {
      const from = new Date(fromDate).toISOString().split('T')[0];
      const to = new Date(toDate).toISOString().split('T')[0];
      return `${from}_to_${to}`;
    }

    return `${filterType}_${date}`;
  }
}