import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { App } from './app';

import { provideStoreDevtools } from '@ngrx/store-devtools';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './shared/components/header-component/header-component';
import { SidebarComponent } from './shared/components/sidebar-component/sidebar-component';
import { SharedLayout } from './features/private/shared-layout/shared-layout';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

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
    StoreModule.forRoot({}, {}), // <--- root store
    EffectsModule.forRoot([]), // <--- root effects
  ],
  providers: [provideBrowserGlobalErrorListeners(), provideStoreDevtools()],
  bootstrap: [App],
})
export class AppModule {}
