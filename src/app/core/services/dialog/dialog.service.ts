import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogData,
} from '../../../shared/components/confirmation-dialog/confirmation-dialog';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  openSuccessDialog(
    title: string,
    message: string,
    confirmText: string = 'OK'
  ): Observable<boolean> {
    const dialogRef: MatDialogRef<ConfirmationDialogComponent> =
      this.dialog.open(ConfirmationDialogComponent, {
        width: '400px',
        data: {
          title,
          message,
          confirmText,
          cancelText: '',
          type: 'success',
        } as ConfirmationDialogData,
        disableClose: false,
        panelClass: 'success-dialog',
      });

    return dialogRef.afterClosed();
  }

  openWarningDialog(
    title: string,
    message: string,
    confirmText: string = 'Continue',
    cancelText: string = 'Cancel'
  ): Observable<boolean> {
    const dialogRef: MatDialogRef<ConfirmationDialogComponent> =
      this.dialog.open(ConfirmationDialogComponent, {
        width: '400px',
        data: {
          title,
          message,
          confirmText,
          cancelText,
          type: 'warning',
        } as ConfirmationDialogData,
        disableClose: false,
        panelClass: 'warning-dialog',
      });

    return dialogRef.afterClosed();
  }

  openDeleteDialog(
    title: string,
    message: string,
    confirmText: string = 'Delete',
    cancelText: string = 'Cancel'
  ): Observable<boolean> {
    const dialogRef: MatDialogRef<ConfirmationDialogComponent> =
      this.dialog.open(ConfirmationDialogComponent, {
        width: '400px',
        data: {
          title,
          message,
          confirmText,
          cancelText,
          type: 'delete',
        } as ConfirmationDialogData,
        disableClose: false,
        panelClass: 'delete-dialog',
      });

    return dialogRef.afterClosed();
  }

  openInfoDialog(
    title: string,
    message: string,
    confirmText: string = 'OK',
    cancelText: string = 'Cancel'
  ): Observable<boolean> {
    const dialogRef: MatDialogRef<ConfirmationDialogComponent> =
      this.dialog.open(ConfirmationDialogComponent, {
        width: '400px',
        data: {
          title,
          message,
          confirmText,
          cancelText,
          type: 'info',
        } as ConfirmationDialogData,
        disableClose: false,
        panelClass: 'info-dialog',
      });

    return dialogRef.afterClosed();
  }

  openCustomDialog(
    data: ConfirmationDialogData,
    width: string = '400px'
  ): Observable<boolean> {
    const dialogRef: MatDialogRef<ConfirmationDialogComponent> =
      this.dialog.open(ConfirmationDialogComponent, {
        width,
        data,
        disableClose: false,
        panelClass: `${data.type}-dialog`,
      });
    return dialogRef.afterClosed();
  }
}
