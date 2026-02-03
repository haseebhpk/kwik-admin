import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';

interface PendingInvoice {
    sessionId: number;
    invoiceNo: string;
    username: string;
    invoiceMobileNumber: string;
    userId: number;
    userMobileNumber: string;
    consumedAmount: number;
    energyUsedKWh: number;
    chargePointId: string;
    createdAt: string;
    isInvoiceGenerated: boolean;
}

interface UpdateInvoiceRequest {
    sessionId: number;
    username: string;
    invoiceMobileNumber: string;
}

@Component({
    selector: 'app-pending-invoices',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule],
    templateUrl: './pending-invoices.html',
    styleUrl: './pending-invoices.scss',
})
export class PendingInvoicesComponent implements OnInit {

    pendingInvoices: PendingInvoice[] = [];
    allInvoices: PendingInvoice[] = [];
    loading = false;
    error = '';
    successMessage = '';

    showModal = false;
    selectedInvoice: PendingInvoice | null = null;
    editForm!: FormGroup;
    updatingSessionId: number | null = null;

    // Search filters
    searchSessionId: string = '';
    startDate: string = '';
    endDate: string = '';

    private apiUrl = 'https://localhost:7227/api/Invoice';

    constructor(
        private http: HttpClient,
        private fb: FormBuilder,
        private cdr: ChangeDetectorRef
    ) {
        console.log('[PENDING-INVOICES] Component initialized');
        this.initializeForm();
    }

    ngOnInit(): void {
        console.log('[PENDING-INVOICES] ngOnInit called');
        this.fetchPendingInvoices();
    }

    private initializeForm(): void {
        this.editForm = this.fb.group({
            username: ['', [Validators.required, Validators.maxLength(100)]],
            invoiceMobileNumber: ['', [
                Validators.required,
                Validators.pattern(/^\d{10}$/),
                Validators.minLength(10),
                Validators.maxLength(10)
            ]]
        });
        console.log('[PENDING-INVOICES] Edit form initialized - accepts 10 digits only');
    }

    fetchPendingInvoices(): void {
        console.log('[PENDING-INVOICES] 📤 Fetching pending invoices...');
        this.loading = true;
        this.error = '';
        this.successMessage = '';
        this.cdr.detectChanges();

        const url = `${this.apiUrl}/pending`;
        console.log('[PENDING-INVOICES] Request URL:', url);

        this.http.get<any>(url)
            .pipe(finalize(() => {
                this.loading = false;
                this.cdr.detectChanges();
                console.log('[PENDING-INVOICES] Request completed, loading set to false');
            }))
            .subscribe({
                next: (response) => {
                    console.log('[PENDING-INVOICES] 📥 Response received:', response);

                    if (response && response.success && Array.isArray(response.data)) {
                        this.allInvoices = [...response.data]; // Store all invoices
                        console.log('[PENDING-INVOICES] ✅ Successfully loaded', this.allInvoices.length, 'pending invoices');
                        console.log('[PENDING-INVOICES] Invoice data:', this.allInvoices);

                        // Apply filters
                        this.applyFilters();
                    } else {
                        this.allInvoices = [];
                        this.pendingInvoices = [];
                        console.warn('[PENDING-INVOICES] ⚠️ Unexpected response format:', response);
                    }

                    this.cdr.detectChanges();
                },
                error: (err) => {
                    console.error('[PENDING-INVOICES] ❌ Error fetching pending invoices:', err);
                    console.error('[PENDING-INVOICES] Error details:', {
                        status: err.status,
                        statusText: err.statusText,
                        message: err.message,
                        error: err.error
                    });
                    this.error = 'Failed to load pending invoices. Please try again.';
                    this.pendingInvoices = [];
                    this.cdr.detectChanges();
                }
            });
    }

    applyFilters(): void {
        console.log('[PENDING-INVOICES] 🔍 Applying filters...', {
            searchSessionId: this.searchSessionId,
            startDate: this.startDate,
            endDate: this.endDate
        });

        this.pendingInvoices = this.allInvoices.filter(invoice => {
            // Session ID filter
            const sessionIdMatch = this.searchSessionId
                ? invoice.sessionId.toString().includes(this.searchSessionId)
                : true;

            // Date range filter
            const invoiceDate = new Date(invoice.createdAt);

            const startDateMatch = this.startDate
                ? invoiceDate >= new Date(this.startDate)
                : true;

            const endDateMatch = this.endDate
                ? invoiceDate <= new Date(this.endDate + 'T23:59:59')
                : true;

            return sessionIdMatch && startDateMatch && endDateMatch;
        });

        console.log('[PENDING-INVOICES] ✅ Filters applied. Showing', this.pendingInvoices.length, 'of', this.allInvoices.length, 'invoices');
        this.cdr.detectChanges();
    }

    openEditModal(invoice: PendingInvoice): void {
        console.log('[PENDING-INVOICES] 📝 Opening edit modal for session:', invoice.sessionId);
        console.log('[PENDING-INVOICES] Current values:', {
            username: invoice.username,
            invoiceMobileNumber: invoice.invoiceMobileNumber
        });

        this.selectedInvoice = invoice;
        this.showModal = true;

        // Strip +91 prefix for display - user only enters 10 digits
        let mobileNumber = invoice.invoiceMobileNumber || '';
        if (mobileNumber.startsWith('+91')) {
            mobileNumber = mobileNumber.substring(3); // Remove +91
        } else if (mobileNumber.startsWith('91')) {
            mobileNumber = mobileNumber.substring(2); // Remove 91
        }
        // Keep only 10 digits
        mobileNumber = mobileNumber.replace(/\D/g, '').substring(0, 10);

        this.editForm.patchValue({
            username: invoice.username || '',
            invoiceMobileNumber: mobileNumber
        });

        this.error = '';
        this.successMessage = '';
        this.cdr.detectChanges();
        console.log('[PENDING-INVOICES] Modal opened - user will enter 10 digits:', mobileNumber);
    }

    closeModal(): void {
        console.log('[PENDING-INVOICES] ❌ Closing modal for session:', this.selectedInvoice?.sessionId);
        this.showModal = false;
        this.selectedInvoice = null;
        this.editForm.reset();
        this.error = '';
        this.cdr.detectChanges();
        console.log('[PENDING-INVOICES] Modal closed');
    }

    saveInvoiceDetails(): void {
        if (!this.selectedInvoice) {
            console.error('[PENDING-INVOICES] ❌ No invoice selected');
            return;
        }

        const sessionId = this.selectedInvoice.sessionId;
        console.log('[PENDING-INVOICES] 💾 Attempting to save invoice details for session:', sessionId);

        if (this.editForm.invalid) {
            console.warn('[PENDING-INVOICES] ⚠️ Form validation failed');
            console.log('[PENDING-INVOICES] Form errors:', this.editForm.errors);
            console.log('[PENDING-INVOICES] Username errors:', this.editForm.get('username')?.errors);
            console.log('[PENDING-INVOICES] Mobile number errors:', this.editForm.get('invoiceMobileNumber')?.errors);
            this.error = 'Please fix the validation errors before saving.';
            return;
        }

        const formValue = this.editForm.value;

        // Add +91 prefix to the 10-digit mobile number
        const mobileWithPrefix = '+91' + formValue.invoiceMobileNumber;

        const request: UpdateInvoiceRequest = {
            sessionId: sessionId,
            username: formValue.username,
            invoiceMobileNumber: mobileWithPrefix
        };

        console.log('[PENDING-INVOICES] 📤 Sending update request:', request);
        console.log('[PENDING-INVOICES] Mobile number sent to backend:', mobileWithPrefix);

        this.updatingSessionId = sessionId;
        this.error = '';
        this.successMessage = '';
        this.cdr.detectChanges();

        const url = `${this.apiUrl}/update-details`;
        console.log('[PENDING-INVOICES] Update URL:', url);

        this.http.put<any>(url, request)
            .pipe(finalize(() => {
                this.updatingSessionId = null;
                this.cdr.detectChanges();
                console.log('[PENDING-INVOICES] Update request completed');
            }))
            .subscribe({
                next: (response) => {
                    console.log('[PENDING-INVOICES] 📥 Update response received:', response);
                    console.log('[PENDING-INVOICES] ✅ Invoice details updated successfully');
                    console.log('[PENDING-INVOICES] ✅ Invoice marked as generated (IsInvoiceGenerated = true)');

                    this.successMessage = `Invoice ${sessionId} updated and marked as generated!`;

                    // Immediately remove the updated invoice from the local array
                    console.log('[PENDING-INVOICES] �️ Removing invoice from local array...');
                    const indexToRemove = this.pendingInvoices.findIndex(inv => inv.sessionId === sessionId);
                    if (indexToRemove !== -1) {
                        this.pendingInvoices.splice(indexToRemove, 1);
                        console.log('[PENDING-INVOICES] ✅ Invoice removed from local array. Remaining:', this.pendingInvoices.length);
                    }

                    // Close modal and trigger change detection
                    this.closeModal();
                    this.cdr.detectChanges();

                    // Refresh from server to ensure data consistency
                    console.log('[PENDING-INVOICES] 🔄 Refreshing from server for data consistency...');
                    setTimeout(() => {
                        this.fetchPendingInvoices();
                    }, 500);
                },
                error: (err) => {
                    console.error('[PENDING-INVOICES] ❌ Error updating invoice details:', err);
                    console.error('[PENDING-INVOICES] Error details:', {
                        status: err.status,
                        statusText: err.statusText,
                        message: err.message,
                        error: err.error
                    });

                    this.error = err.error?.error || err.error?.message || 'Failed to update invoice details. Please try again.';
                    this.cdr.detectChanges();
                }
            });
    }

    get usernameError(): string | null {
        const control = this.editForm.get('username');
        if (control?.hasError('required') && control?.touched) {
            return 'Username is required';
        }
        if (control?.hasError('maxlength')) {
            return 'Username cannot exceed 100 characters';
        }
        return null;
    }

    get mobileError(): string | null {
        const control = this.editForm.get('invoiceMobileNumber');
        if (control?.hasError('required') && control?.touched) {
            return 'Mobile number is required';
        }
        if (control?.hasError('pattern') || control?.hasError('minLength') || control?.hasError('maxLength')) {
            return 'Mobile number must be exactly 10 digits';
        }
        return null;
    }

    formatDate(dateString: string): string {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}
