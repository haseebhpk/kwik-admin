// import { Component, OnInit } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import * as XLSX from 'xlsx';
// import { saveAs } from 'file-saver';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';
// import { CommonModule, DatePipe } from '@angular/common';
// import { ChangeDetectorRef } from '@angular/core';
// import { FormsModule } from '@angular/forms';



// @Component({
//   selector: 'app-admin-summary',
//   templateUrl: './admin-summary.html',
//   styleUrl: './admin-summary.scss',
//   imports: [CommonModule, DatePipe, FormsModule],

// })
// export class AdminSummaryComponent implements OnInit {

//   adminSummary: any[] = [];
//   apiUrl = 'https://localhost:7227/api/admin-summary';

//   constructor(private http: HttpClient,
//       private cdr: ChangeDetectorRef

//   ) {}



//   allData: any[] = [];
// filteredData: any[] = [];
// startDate: string = '';
// endDate: string = '';
// searchName: string = '';
// searchPhone: string = '';


//   ngOnInit(): void {
//     this.loadData();
//   }

// loadData() {
//   this.http.get<any[]>(this.apiUrl).subscribe({
//     next: (res) => {
//       this.allData = res;
//       this.applyFilters();
//       this.cdr.detectChanges();
//     },
//     error: (err) => {
//       console.error('API Error:', err);
//     }
//   });
// }


// applyFilters() {
//   this.filteredData = this.allData.filter(item => {

//     const sessionDate = new Date(item.startTime);

//     const startOk = this.startDate
//       ? sessionDate >= new Date(this.startDate)
//       : true;

//     const endOk = this.endDate
//       ? sessionDate <= new Date(this.endDate + 'T23:59:59')
//       : true;

//     const nameOk = this.searchName
//       ? item.userName?.toLowerCase().includes(this.searchName.toLowerCase())
//       : true;

//     const phoneOk = this.searchPhone
//       ? item.phoneNumber?.includes(this.searchPhone)
//       : true;

//     return startOk && endOk && nameOk && phoneOk;
//   });

//   this.adminSummary = this.filteredData;
// }


//   // ================= EXCEL DOWNLOAD =================
//   downloadExcel() {
//    // const worksheet = XLSX.utils.json_to_sheet(this.adminSummary);
//      const worksheet = XLSX.utils.json_to_sheet(this.filteredData);

//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'AdminSummary');

//     const excelBuffer = XLSX.write(workbook, {
//       bookType: 'xlsx',
//       type: 'array'
//     });

//     const blob = new Blob([excelBuffer], {
//       type: 'application/octet-stream'
//     });

//     saveAs(blob, 'admin-summary.xlsx');
//   }

//   // ================= PDF DOWNLOAD =================
//   downloadPdf() {
//     const doc = new jsPDF();

//     autoTable(doc, {
//       head: [[
//         'Session ID',
//         'User Name',
//         'Phone',
//         'Energy (kWh)',
//         'Amount',
//         'Start Time',
//         'End Time'
//       ]],
//       body: this.filteredData.map(item => [
//         item.chargingSessionId,
//         item.userName,
//         item.phoneNumber,
//         item.energyUsedKWh,
//         item.consumedAmount,
//         new Date(item.startTime).toLocaleString(),
//         new Date(item.endTime).toLocaleString()
//       ])
//     });

//     doc.save('admin-summary.pdf');
//   }

//   downloadInvoice(sessionId: number) {
//   const url = `https://localhost:7227/api/Invoice/pdf/${sessionId}`;

//   this.http.get(url, { responseType: 'blob' }).subscribe({
//     next: (blob) => {
//       const file = new Blob([blob], { type: 'application/pdf' });
//       const fileUrl = window.URL.createObjectURL(file);

//       const a = document.createElement('a');
//       a.href = fileUrl;
//       a.download = `invoice-${sessionId}.pdf`;
//       a.click();

//       window.URL.revokeObjectURL(fileUrl);
//     },
//     error: (err) => {
//       console.error('Invoice download failed', err);
//       alert('Invoice not available');
//     }
//   });
// }

// }





//cld test
// import { Component, OnInit } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import * as XLSX from 'xlsx';
// import { saveAs } from 'file-saver';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';
// import { CommonModule, DatePipe } from '@angular/common';
// import { ChangeDetectorRef } from '@angular/core';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-admin-summary',
//   templateUrl: './admin-summary.html',
//   styleUrl: './admin-summary.scss',
//   imports: [CommonModule, DatePipe, FormsModule],
// })
// export class AdminSummaryComponent implements OnInit {

//   adminSummary: any[] = [];
//   apiUrl = 'https://localhost:7227/api/admin-summary';

//   constructor(
//     private http: HttpClient,
//     private cdr: ChangeDetectorRef
//   ) {}

//   allData: any[] = [];
//   filteredData: any[] = [];
//   startDate: string = '';
//   endDate: string = '';
//   searchName: string = '';
//   searchPhone: string = '';

//   ngOnInit(): void {
//     this.loadData();
//   }

//   loadData() {
//     this.http.get<any[]>(this.apiUrl).subscribe({
//       next: (res) => {
//         this.allData = res;
//         this.applyFilters();
//         this.cdr.detectChanges();
//       },
//       error: (err) => {
//         console.error('API Error:', err);
//       }
//     });
//   }

//   applyFilters() {
//     this.filteredData = this.allData.filter(item => {
//       const sessionDate = new Date(item.startTime);

//       const startOk = this.startDate
//         ? sessionDate >= new Date(this.startDate)
//         : true;

//       const endOk = this.endDate
//         ? sessionDate <= new Date(this.endDate + 'T23:59:59')
//         : true;

//       const nameOk = this.searchName
//         ? item.userName?.toLowerCase().includes(this.searchName.toLowerCase())
//         : true;

//       const phoneOk = this.searchPhone
//         ? item.phoneNumber?.includes(this.searchPhone)
//         : true;

//       return startOk && endOk && nameOk && phoneOk;
//     });

//     this.adminSummary = this.filteredData;
//   }

//   // ================= EXCEL DOWNLOAD =================
//   downloadExcel() {
//     const worksheet = XLSX.utils.json_to_sheet(this.filteredData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'AdminSummary');

//     const excelBuffer = XLSX.write(workbook, {
//       bookType: 'xlsx',
//       type: 'array'
//     });

//     const blob = new Blob([excelBuffer], {
//       type: 'application/octet-stream'
//     });

//     saveAs(blob, 'admin-summary.xlsx');
//   }

//   // ================= ENHANCED PDF DOWNLOAD =================
//   downloadPdf() {
//     const doc = new jsPDF('l', 'mm', 'a4'); // Landscape for more columns
//     const pageWidth = doc.internal.pageSize.getWidth();
//     const pageHeight = doc.internal.pageSize.getHeight();
    
//     // Calculate summary statistics
//     const stats = this.calculateStatistics();

//     // ========== COVER PAGE ==========
//     this.addCoverPage(doc, stats, pageWidth, pageHeight);
    
//     // ========== DATA PAGES ==========
//     doc.addPage();

//     // Add header and footer function
//     const addHeaderFooter = (data: any) => {
//       const pageNumber = (doc as any).internal.getNumberOfPages();
      
//       // Header
//       doc.setFillColor(41, 128, 185);
//       doc.rect(0, 0, pageWidth, 25, 'F');
      
//       doc.setTextColor(255, 255, 255);
//       doc.setFontSize(16);
//       doc.setFont('helvetica', 'bold');
//       doc.text('Charging Sessions Report', 14, 12);
      
//       doc.setFontSize(9);
//       doc.setFont('helvetica', 'normal');
//       doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 19);
//       doc.text(`Total Records: ${this.filteredData.length}`, pageWidth - 14, 19, { align: 'right' });
      
//       // Footer
//       doc.setFillColor(52, 73, 94);
//       doc.rect(0, pageHeight - 15, pageWidth, 15, 'F');
      
//       doc.setTextColor(255, 255, 255);
//       doc.setFontSize(8);
//       doc.text(`Page ${data.pageNumber || pageNumber}`, pageWidth / 2, pageHeight - 7, { align: 'center' });
//       doc.text('© EV Charging Management System', 14, pageHeight - 7);
//       doc.text(new Date().toLocaleDateString(), pageWidth - 14, pageHeight - 7, { align: 'right' });
//     };

//     // Table data
//     const tableData = this.filteredData.map((item, index) => [
//       (index + 1).toString(),
//       item.chargingSessionId || 'N/A',
//       item.userName || 'Unknown',
//       item.phoneNumber || 'N/A',
//       `${(item.energyUsedKWh || 0).toFixed(2)} kWh`,
//       `₹ ${(item.consumedAmount || 0).toFixed(2)}`,
//       this.formatDateTime(item.startTime),
//       this.formatDateTime(item.endTime),
//       this.calculateDuration(item.startTime, item.endTime)
//     ]);

//     autoTable(doc, {
//       startY: 30,
//       head: [[
//         '#',
//         'Session ID',
//         'User Name',
//         'Phone',
//         'Energy',
//         'Amount',
//         'Start Time',
//         'End Time',
//         'Duration'
//       ]],
//       body: tableData,
//       theme: 'striped',
//       headStyles: {
//         fillColor: [52, 152, 219],
//         textColor: [255, 255, 255],
//         fontSize: 9,
//         fontStyle: 'bold',
//         halign: 'center',
//         cellPadding: 4
//       },
//       bodyStyles: {
//         fontSize: 8,
//         cellPadding: 3
//       },
//       columnStyles: {
//         0: { cellWidth: 10, halign: 'center', fontStyle: 'bold' },
//         1: { cellWidth: 20, halign: 'center' },
//         2: { cellWidth: 35 },
//         3: { cellWidth: 25, halign: 'center' },
//         4: { cellWidth: 25, halign: 'right', fontStyle: 'bold', textColor: [41, 128, 185] },
//         5: { cellWidth: 28, halign: 'right', fontStyle: 'bold', textColor: [39, 174, 96] },
//         6: { cellWidth: 35, fontSize: 7 },
//         7: { cellWidth: 35, fontSize: 7 },
//         8: { cellWidth: 20, halign: 'center' }
//       },
//       alternateRowStyles: {
//         fillColor: [245, 247, 250]
//       },
//       margin: { top: 30, bottom: 20, left: 14, right: 14 },
//       didDrawPage: addHeaderFooter
//     });

//     // ========== SUMMARY PAGE AT END ==========
//     doc.addPage();
//     this.addSummaryPage(doc, stats, pageWidth, pageHeight);
//     addHeaderFooter({});

//     // Save PDF
//     const fileName = this.generateFileName();
//     doc.save(fileName);
//   }

//   // ========== COVER PAGE ==========
//   private addCoverPage(doc: jsPDF, stats: any, pageWidth: number, pageHeight: number) {
//     // Background gradient effect
//     doc.setFillColor(41, 128, 185);
//     doc.rect(0, 0, pageWidth, pageHeight / 2, 'F');
    
//     doc.setFillColor(52, 152, 219);
//     doc.rect(0, pageHeight / 2, pageWidth, pageHeight / 2, 'F');

//     // Main Title
//     doc.setTextColor(255, 255, 255);
//     doc.setFontSize(32);
//     doc.setFont('helvetica', 'bold');
//     doc.text('CHARGING SESSIONS', pageWidth / 2, 50, { align: 'center' });
    
//     doc.setFontSize(28);
//     doc.text('DETAILED REPORT', pageWidth / 2, 65, { align: 'center' });

//     // Date Range Box
//     if (this.startDate || this.endDate) {
//       doc.setFillColor(255, 255, 255);
//       doc.roundedRect(pageWidth / 2 - 60, 80, 120, 20, 3, 3, 'F');
      
//       doc.setTextColor(41, 128, 185);
//       doc.setFontSize(11);
//       doc.setFont('helvetica', 'bold');
      
//       const dateRange = this.getDateRangeText();
//       doc.text(dateRange, pageWidth / 2, 92, { align: 'center' });
//     }

//     // Statistics Cards
//     const cardY = 115;
//     const cardWidth = 50;
//     const cardHeight = 30;
//     const gap = 10;
//     const totalWidth = (cardWidth * 4) + (gap * 3);
//     let startX = (pageWidth - totalWidth) / 2;

//     const cards = [
//       { label: 'Total Sessions', value: stats.totalSessions, color: [231, 76, 60] },
//       { label: 'Total Energy', value: `${stats.totalEnergy.toFixed(2)} kWh`, color: [241, 196, 15] },
//       { label: 'Total Revenue', value: `₹ ${stats.totalRevenue.toFixed(2)}`, color: [46, 204, 113] },
//       { label: 'Avg Duration', value: stats.avgDuration, color: [155, 89, 182] }
//     ];

//     cards.forEach((card, index) => {
//       const x = startX + (index * (cardWidth + gap));
      
//       // Card background
//       doc.setFillColor(255, 255, 255);
//       doc.roundedRect(x, cardY, cardWidth, cardHeight, 3, 3, 'F');
      
//       // Colored top stripe
//       doc.setFillColor(card.color[0], card.color[1], card.color[2]);
//       doc.rect(x, cardY, cardWidth, 3, 'F');
      
//       // Label
//       doc.setTextColor(100, 100, 100);
//       doc.setFontSize(8);
//       doc.setFont('helvetica', 'normal');
//       doc.text(card.label, x + cardWidth / 2, cardY + 12, { align: 'center' });
      
//       // Value
//       doc.setTextColor(50, 50, 50);
//       doc.setFontSize(12);
//       doc.setFont('helvetica', 'bold');
//       doc.text(card.value.toString(), x + cardWidth / 2, cardY + 22, { align: 'center' });
//     });

//     // Footer info
//     doc.setTextColor(255, 255, 255);
//     doc.setFontSize(10);
//     doc.setFont('helvetica', 'normal');
//     doc.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth / 2, pageHeight - 30, { align: 'center' });
//     doc.text(`Total Records: ${this.filteredData.length}`, pageWidth / 2, pageHeight - 20, { align: 'center' });
//   }

//   // ========== SUMMARY PAGE ==========
//   private addSummaryPage(doc: jsPDF, stats: any, pageWidth: number, pageHeight: number) {
//     doc.setFillColor(41, 128, 185);
//     doc.rect(0, 30, pageWidth, 20, 'F');
    
//     doc.setTextColor(255, 255, 255);
//     doc.setFontSize(18);
//     doc.setFont('helvetica', 'bold');
//     doc.text('REPORT SUMMARY', pageWidth / 2, 42, { align: 'center' });

//     // Summary table
//     const summaryData = [
//       ['Total Charging Sessions', stats.totalSessions.toString()],
//       ['Total Energy Consumed', `${stats.totalEnergy.toFixed(2)} kWh`],
//       ['Total Revenue Generated', `₹ ${stats.totalRevenue.toFixed(2)}`],
//       ['Average Energy per Session', `${stats.avgEnergy.toFixed(2)} kWh`],
//       ['Average Amount per Session', `₹ ${stats.avgAmount.toFixed(2)}`],
//       ['Average Session Duration', stats.avgDuration],
//       ['Longest Session Duration', stats.maxDuration],
//       ['Shortest Session Duration', stats.minDuration]
//     ];

//     autoTable(doc, {
//       startY: 60,
//       body: summaryData,
//       theme: 'grid',
//       styles: {
//         fontSize: 11,
//         cellPadding: 6
//       },
//       columnStyles: {
//         0: { 
//           cellWidth: 100, 
//           fontStyle: 'bold', 
//           fillColor: [245, 247, 250],
//           textColor: [52, 73, 94]
//         },
//         1: { 
//           cellWidth: 80, 
//           halign: 'right', 
//           fontStyle: 'bold',
//           textColor: [41, 128, 185]
//         }
//       },
//       margin: { left: (pageWidth - 180) / 2 }
//     });

//     // Filter information
//     const finalY = (doc as any).lastAutoTable.finalY + 20;
    
//     doc.setFillColor(245, 247, 250);
//     doc.roundedRect(14, finalY, pageWidth - 28, 40, 3, 3, 'F');
    
//     doc.setTextColor(52, 73, 94);
//     doc.setFontSize(12);
//     doc.setFont('helvetica', 'bold');
//     doc.text('Applied Filters:', 20, finalY + 10);
    
//     doc.setFontSize(10);
//     doc.setFont('helvetica', 'normal');
    
//     let filterText = '';
//     if (this.startDate) filterText += `Start Date: ${new Date(this.startDate).toLocaleDateString()} | `;
//     if (this.endDate) filterText += `End Date: ${new Date(this.endDate).toLocaleDateString()} | `;
//     if (this.searchName) filterText += `Name Filter: "${this.searchName}" | `;
//     if (this.searchPhone) filterText += `Phone Filter: "${this.searchPhone}" | `;
    
//     if (filterText) {
//       filterText = filterText.slice(0, -3); // Remove last " | "
//       doc.text(filterText, 20, finalY + 20);
//     } else {
//       doc.text('No filters applied - showing all records', 20, finalY + 20);
//     }

//     doc.setTextColor(100, 100, 100);
//     doc.setFontSize(8);
//     doc.text('This report is system-generated and contains confidential information.', 20, finalY + 32);
//   }

//   // ========== HELPER METHODS ==========
//   private calculateStatistics() {
//     const totalSessions = this.filteredData.length;
//     const totalEnergy = this.filteredData.reduce((sum, item) => sum + (item.energyUsedKWh || 0), 0);
//     const totalRevenue = this.filteredData.reduce((sum, item) => sum + (item.consumedAmount || 0), 0);
    
//     const durations = this.filteredData.map(item => {
//       const start = new Date(item.startTime).getTime();
//       const end = new Date(item.endTime).getTime();
//       return (end - start) / (1000 * 60); // minutes
//     }).filter(d => d > 0);

//     const avgDurationMin = durations.reduce((a, b) => a + b, 0) / durations.length || 0;
    
//     return {
//       totalSessions,
//       totalEnergy,
//       totalRevenue,
//       avgEnergy: totalEnergy / totalSessions || 0,
//       avgAmount: totalRevenue / totalSessions || 0,
//       avgDuration: this.formatDurationMinutes(avgDurationMin),
//       maxDuration: this.formatDurationMinutes(Math.max(...durations, 0)),
//       minDuration: this.formatDurationMinutes(Math.min(...durations, Infinity))
//     };
//   }

//   private formatDateTime(dateStr: string): string {
//     if (!dateStr) return 'N/A';
//     const date = new Date(dateStr);
//     return date.toLocaleString('en-IN', { 
//       day: '2-digit', 
//       month: 'short', 
//       year: 'numeric',
//       hour: '2-digit', 
//       minute: '2-digit'
//     });
//   }

//   private calculateDuration(start: string, end: string): string {
//     if (!start || !end) return 'N/A';
//     const startTime = new Date(start).getTime();
//     const endTime = new Date(end).getTime();
//     const diffMin = Math.round((endTime - startTime) / (1000 * 60));
//     return this.formatDurationMinutes(diffMin);
//   }

//   private formatDurationMinutes(minutes: number): string {
//     if (!minutes || minutes < 0) return '0m';
//     const hours = Math.floor(minutes / 60);
//     const mins = Math.round(minutes % 60);
//     return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
//   }

//   private getDateRangeText(): string {
//     if (this.startDate && this.endDate) {
//       return `${new Date(this.startDate).toLocaleDateString()} - ${new Date(this.endDate).toLocaleDateString()}`;
//     } else if (this.startDate) {
//       return `From: ${new Date(this.startDate).toLocaleDateString()}`;
//     } else if (this.endDate) {
//       return `Until: ${new Date(this.endDate).toLocaleDateString()}`;
//     }
//     return 'All Time';
//   }

//   private generateFileName(): string {
//     const date = new Date().toISOString().split('T')[0];
//     let fileName = `Charging_Sessions_Report_${date}`;
    
//     if (this.startDate || this.endDate) {
//       fileName += '_Filtered';
//     }
    
//     return `${fileName}.pdf`;
//   }

//   // ================= INVOICE DOWNLOAD =================
//   downloadInvoice(sessionId: number) {
//     const url = `https://localhost:7227/api/Invoice/pdf/${sessionId}`;

//     this.http.get(url, { responseType: 'blob' }).subscribe({
//       next: (blob) => {
//         const file = new Blob([blob], { type: 'application/pdf' });
//         const fileUrl = window.URL.createObjectURL(file);

//         const a = document.createElement('a');
//         a.href = fileUrl;
//         a.download = `invoice-${sessionId}.pdf`;
//         a.click();

//         window.URL.revokeObjectURL(fileUrl);
//       },
//       error: (err) => {
//         console.error('Invoice download failed', err);
//         alert('Invoice not available');
//       }
//     });
//   }
// }




//cld 
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-summary',
  templateUrl: './admin-summary.html',
  styleUrl: './admin-summary.scss',
  imports: [CommonModule, DatePipe, FormsModule],
})
export class AdminSummaryComponent implements OnInit {

  adminSummary: any[] = [];
  apiUrl = 'https://localhost:7227/api/admin-summary';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  allData: any[] = [];
  filteredData: any[] = [];
  startDate: string = '';
  endDate: string = '';
  searchName: string = '';
  searchPhone: string = '';

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (res) => {
        this.allData = res;
        this.applyFilters();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('API Error:', err);
      }
    });
  }

  applyFilters() {
    this.filteredData = this.allData.filter(item => {
      const sessionDate = new Date(item.startTime);

      const startOk = this.startDate
        ? sessionDate >= new Date(this.startDate)
        : true;

      const endOk = this.endDate
        ? sessionDate <= new Date(this.endDate + 'T23:59:59')
        : true;

      const nameOk = this.searchName
        ? item.userName?.toLowerCase().includes(this.searchName.toLowerCase())
        : true;

      const phoneOk = this.searchPhone
        ? item.phoneNumber?.includes(this.searchPhone)
        : true;

      return startOk && endOk && nameOk && phoneOk;
    });

    this.adminSummary = this.filteredData;
  }

  // ================= EXCEL DOWNLOAD =================
  downloadExcel() {
    const worksheet = XLSX.utils.json_to_sheet(this.filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'AdminSummary');

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });

    const blob = new Blob([excelBuffer], {
      type: 'application/octet-stream'
    });

    saveAs(blob, 'admin-summary.xlsx');
  }

  // ================= PDF DOWNLOAD =================
  downloadPdf() {
    const doc = new jsPDF('l', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFillColor(41, 128, 185);
    doc.rect(0, 0, pageWidth, 30, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Session Report', pageWidth / 2, 15, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, 23, { align: 'center' });

    // Table
    autoTable(doc, {
      startY: 35,
      head: [[
        'Session ID',
        'User Name',
        'Phone',
        'Energy (kWh)',
        'Amount',
        'Start Time',
        'End Time'
      ]],
      body: this.filteredData.map(item => [
        item.chargingSessionId,
        item.userName,
        item.phoneNumber,
        item.energyUsedKWh,
        item.consumedAmount,
        new Date(item.startTime).toLocaleString(),
        new Date(item.endTime).toLocaleString()
      ]),
      theme: 'striped',
      headStyles: {
        fillColor: [52, 152, 219],
        fontSize: 10,
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 9
      },
      margin: { top: 35 }
    });

    doc.save('admin-summary.pdf');
  }

  downloadInvoice(sessionId: number) {
    const url = `https://localhost:7227/api/Invoice/pdf/${sessionId}`;

    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const file = new Blob([blob], { type: 'application/pdf' });
        const fileUrl = window.URL.createObjectURL(file);

        const a = document.createElement('a');
        a.href = fileUrl;
        a.download = `invoice-${sessionId}.pdf`;
        a.click();

        window.URL.revokeObjectURL(fileUrl);
      },
      error: (err) => {
        console.error('Invoice download failed', err);
        alert('Invoice not available');
      }
    });
  }
}