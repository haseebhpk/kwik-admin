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
  ) { }

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
    console.log('[ADMIN-SUMMARY] 📤 Fetching charging sessions...');
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (res) => {
        console.log('[ADMIN-SUMMARY] 📥 Response received:', res);
        this.allData = res;

        // Log invoice generation status
        const generatedCount = res.filter(item => item.isInvoiceGenerated).length;
        const pendingCount = res.filter(item => !item.isInvoiceGenerated).length;
        console.log('[ADMIN-SUMMARY] ✅ Invoices Generated:', generatedCount);
        console.log('[ADMIN-SUMMARY] ⏳ Invoices Pending:', pendingCount);

        this.applyFilters();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('[ADMIN-SUMMARY] ❌ API Error:', err);
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
    console.log('[ADMIN-SUMMARY] 📄 Invoice download requested for session:', sessionId);
    const url = `https://localhost:7227/api/Invoice/pdf/${sessionId}`;
    console.log('[ADMIN-SUMMARY] Download URL:', url);

    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        console.log('[ADMIN-SUMMARY] 📥 PDF blob received, size:', blob.size, 'bytes');
        const file = new Blob([blob], { type: 'application/pdf' });
        const fileUrl = window.URL.createObjectURL(file);

        const a = document.createElement('a');
        a.href = fileUrl;
        a.download = `invoice-${sessionId}.pdf`;
        a.click();

        window.URL.revokeObjectURL(fileUrl);
        console.log('[ADMIN-SUMMARY] ✅ Invoice downloaded successfully');
      },
      error: (err) => {
        console.error('[ADMIN-SUMMARY] ❌ Invoice download failed:', err);
        console.error('[ADMIN-SUMMARY] Error details:', {
          status: err.status,
          statusText: err.statusText,
          message: err.message
        });
        alert('Invoice not available');
      }
    });
  }
}