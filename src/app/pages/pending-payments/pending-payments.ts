import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';

interface PendingPayment {
    transactionId: number;
    sessionId: number;
    username: string;
    phoneNumber: string;
    energyUsedKWh: number;
    consumedAmount: number;
    startTime: string;
    endTime: string;
    chargePointId: string;
    paymentStatus: string;
    createdAt: string;
}

interface MarkAsPaidRequest {
    transactionId: number;
}

@Component({
    selector: 'app-pending-payments',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './pending-payments.html',
    styleUrl: './pending-payments.scss',
})
export class PendingPaymentsComponent implements OnInit {

    pendingPayments: PendingPayment[] = [];
    allPayments: PendingPayment[] = [];
    loading = false;
    error = '';
    successMessage = '';

    showConfirmModal = false;
    selectedPayment: PendingPayment | null = null;
    markingAsPaid = false;

    // Search filters
    searchSessionId: string = '';
    startDate: string = '';
    endDate: string = '';

    private apiUrl = 'https://localhost:7227/api/admin-payment';

    constructor(
        private http: HttpClient,
        private cdr: ChangeDetectorRef
    ) {
        console.log('[PENDING-PAYMENTS] Component initialized');
    }

    ngOnInit(): void {
        console.log('[PENDING-PAYMENTS] ngOnInit called');
        this.fetchPendingPayments();
    }

    fetchPendingPayments(): void {
        console.log('[PENDING-PAYMENTS] 📤 Fetching pending payments...');
        this.loading = true;
        this.error = '';
        this.successMessage = '';
        this.cdr.detectChanges();

        const url = `${this.apiUrl}/pending`;
        console.log('[PENDING-PAYMENTS] Request URL:', url);

        this.http.get<any>(url)
            .pipe(finalize(() => {
                this.loading = false;
                this.cdr.detectChanges();
                console.log('[PENDING-PAYMENTS] Request completed, loading set to false');
            }))
            .subscribe({
                next: (response) => {
                    console.log('[PENDING-PAYMENTS] 📥 Response received:', response);

                    if (response && response.success && Array.isArray(response.data)) {
                        this.allPayments = [...response.data];
                        console.log('[PENDING-PAYMENTS] ✅ Successfully loaded', this.allPayments.length, 'pending payments');
                        console.log('[PENDING-PAYMENTS] Payment data:', this.allPayments);

                        // Apply filters
                        this.applyFilters();
                    } else {
                        this.allPayments = [];
                        this.pendingPayments = [];
                        console.warn('[PENDING-PAYMENTS] ⚠️ Unexpected response format:', response);
                    }

                    this.cdr.detectChanges();
                },
                error: (err) => {
                    console.error('[PENDING-PAYMENTS] ❌ Error fetching pending payments:', err);
                    console.error('[PENDING-PAYMENTS] Error details:', {
                        status: err.status,
                        statusText: err.statusText,
                        message: err.message,
                        error: err.error
                    });
                    this.error = 'Failed to load pending payments. Please try again.';
                    this.pendingPayments = [];
                    this.cdr.detectChanges();
                }
            });
    }

    applyFilters(): void {
        console.log('[PENDING-PAYMENTS] 🔍 Applying filters...', {
            searchSessionId: this.searchSessionId,
            startDate: this.startDate,
            endDate: this.endDate
        });

        this.pendingPayments = this.allPayments.filter(payment => {
            // Session ID filter
            const sessionIdMatch = this.searchSessionId
                ? payment.sessionId.toString().includes(this.searchSessionId)
                : true;

            // Date range filter
            const paymentDate = new Date(payment.createdAt);

            const startDateMatch = this.startDate
                ? paymentDate >= new Date(this.startDate)
                : true;

            const endDateMatch = this.endDate
                ? paymentDate <= new Date(this.endDate + 'T23:59:59')
                : true;

            return sessionIdMatch && startDateMatch && endDateMatch;
        });

        console.log('[PENDING-PAYMENTS] ✅ Filters applied. Showing', this.pendingPayments.length, 'of', this.allPayments.length, 'payments');
        this.cdr.detectChanges();
    }

    openConfirmModal(payment: PendingPayment): void {
        console.log('[PENDING-PAYMENTS] 💰 Opening confirmation modal for transaction:', payment.transactionId);
        console.log('[PENDING-PAYMENTS] Payment details:', {
            transactionId: payment.transactionId,
            sessionId: payment.sessionId,
            amount: payment.consumedAmount,
            username: payment.username
        });

        this.selectedPayment = payment;
        this.showConfirmModal = true;
        this.error = '';
        this.cdr.detectChanges();
        console.log('[PENDING-PAYMENTS] Confirmation modal opened');
    }

    closeConfirmModal(): void {
        console.log('[PENDING-PAYMENTS] ❌ Closing confirmation modal');
        this.showConfirmModal = false;
        this.selectedPayment = null;
        this.error = '';
        this.cdr.detectChanges();
        console.log('[PENDING-PAYMENTS] Confirmation modal closed');
    }

    markAsPaid(): void {
        if (!this.selectedPayment) {
            console.error('[PENDING-PAYMENTS] ❌ No payment selected');
            return;
        }

        const transactionId = this.selectedPayment.transactionId;
        console.log('[PENDING-PAYMENTS] 💾 Marking transaction as paid:', transactionId);

        const request: MarkAsPaidRequest = {
            transactionId: transactionId
        };

        console.log('[PENDING-PAYMENTS] 📤 Sending mark as paid request:', request);

        this.markingAsPaid = true;
        this.error = '';
        this.cdr.detectChanges();

        const url = `${this.apiUrl}/mark-paid`;
        console.log('[PENDING-PAYMENTS] Mark as paid URL:', url);

        this.http.put<any>(url, request)
            .pipe(finalize(() => {
                this.markingAsPaid = false;
                this.cdr.detectChanges();
                console.log('[PENDING-PAYMENTS] Mark as paid request completed');
            }))
            .subscribe({
                next: (response) => {
                    console.log('[PENDING-PAYMENTS] 📥 Mark as paid response received:', response);
                    console.log('[PENDING-PAYMENTS] ✅ Transaction marked as paid successfully');

                    this.successMessage = `Transaction ${transactionId} marked as paid successfully!`;

                    // Immediately remove the payment from the local array
                    console.log('[PENDING-PAYMENTS] 🗑️ Removing payment from local array...');
                    const indexToRemove = this.pendingPayments.findIndex(p => p.transactionId === transactionId);
                    if (indexToRemove !== -1) {
                        this.pendingPayments.splice(indexToRemove, 1);
                        console.log('[PENDING-PAYMENTS] ✅ Payment removed from local array. Remaining:', this.pendingPayments.length);
                    }

                    // Also remove from allPayments
                    const allIndexToRemove = this.allPayments.findIndex(p => p.transactionId === transactionId);
                    if (allIndexToRemove !== -1) {
                        this.allPayments.splice(allIndexToRemove, 1);
                    }

                    // Close modal and trigger change detection
                    this.closeConfirmModal();
                    this.cdr.detectChanges();

                    // Refresh from server to ensure data consistency
                    console.log('[PENDING-PAYMENTS] 🔄 Refreshing from server for data consistency...');
                    setTimeout(() => {
                        this.fetchPendingPayments();
                    }, 500);
                },
                error: (err) => {
                    console.error('[PENDING-PAYMENTS] ❌ Error marking payment as paid:', err);
                    console.error('[PENDING-PAYMENTS] Error details:', {
                        status: err.status,
                        statusText: err.statusText,
                        message: err.message,
                        error: err.error
                    });

                    this.error = err.error?.error || err.error?.message || 'Failed to mark payment as paid. Please try again.';
                    this.cdr.detectChanges();
                }
            });
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
