import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { BASE_URL } from '@event-management/event-library';
import { environment } from '../Environments/environment';
@NgModule({
  declarations: [App],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    StoreModule.forRoot({}, {}),
    EffectsModule.forRoot([]),
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideStoreDevtools(),
    { provide: BASE_URL, useValue: environment.apiUrl },
  ],
  bootstrap: [App],
})
export class AppModule {}
