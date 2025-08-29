import { NgModule } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
@NgModule({
  imports: [MatListModule, MatButtonModule, MatCardModule, MatIconModule],
  exports: [MatListModule, MatButtonModule, MatCardModule, MatIconModule],
})
export class MaterialModule {}
