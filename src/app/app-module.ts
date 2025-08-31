import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './shared/components/header-component/header-component';
import { SidebarComponent } from './shared/components/sidebar-component/sidebar-component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { RouterModule, RouterOutlet } from '@angular/router';

@NgModule({
  declarations: [App, HeaderComponent, SidebarComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    RouterOutlet,
    HttpClientModule,
    StoreModule.forRoot({}, {}), // <--- root store
    EffectsModule.forRoot([]) // <--- root effects
  ],
  providers: [provideBrowserGlobalErrorListeners(), provideStoreDevtools()],
  bootstrap: [App],
})
export class AppModule {}
