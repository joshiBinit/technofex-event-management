import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationType } from '../../type/confirmation.type';

export interface ConfirmationDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: ConfirmationType;
}

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.html',
  styleUrls: ['./confirmation-dialog.scss'],
  standalone: false,
})
export class ConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData
  ) {
    // Set default values
    this.data.confirmText = this.data.confirmText || ConfirmationType.Confirm;
    this.data.cancelText = this.data.cancelText || ConfirmationType.Cancel;
    this.data.type = this.data.type || ConfirmationType.Info;
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  getIconName(): string {
    switch (this.data.type) {
      case ConfirmationType.Success:
        return 'check_circle';
      case ConfirmationType.Warning:
        return 'warning';
      case ConfirmationType.Delete:
        return 'delete_forever';
      default:
        return ConfirmationType.Info;
    }
  }

  getIconColor(): string {
    switch (this.data.type) {
      case ConfirmationType.Success:
        return 'text-green-600';
      case ConfirmationType.Warning:
        return 'text-yellow-600';
      case ConfirmationType.Delete:
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  }

  getConfirmButtonColor(): string {
    switch (this.data.type) {
      case ConfirmationType.Success:
        return 'primary';
      case ConfirmationType.Warning:
        return 'accent';
      case ConfirmationType.Delete:
        return 'warn';
      default:
        return 'primary';
    }
  }
}
