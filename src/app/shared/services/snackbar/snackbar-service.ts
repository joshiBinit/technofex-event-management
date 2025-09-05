import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private snackbar: MatSnackBar) {}

  show(
    message: string,
    action: string = 'Close',
    type: 'success' | 'error' | 'info' | 'warning' = 'info',
    duration: number = 3000
  ) {
    const config: MatSnackBarConfig = {
      duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [`snackbar-${type}`], // dynamic class
    };

    this.snackbar.open(message, action, config);
  }
}
