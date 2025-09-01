// material.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material modules
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatInputModule,
    MatCardModule,
    MatSidenavModule,
    MatListModule,
    MatTableModule,
    MatDialogModule,
    MatSnackBarModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatSidenavModule,
  ],
})
export class MaterialModule {}
