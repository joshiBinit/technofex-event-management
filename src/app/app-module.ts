import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { App } from './app';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './shared/components/header-component/header-component';
import { SidebarComponent } from './shared/components/sidebar-component/sidebar-component';
import { StoreModule } from '@ngrx/store';
import { RouterModule } from '@angular/router';
import { provideStoreDevtools } from '@ngrx/store-devtools';

@NgModule({
  declarations: [App, HeaderComponent, SidebarComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    HttpClientModule,
    StoreModule.forRoot({}),
  ],

  providers: [provideStoreDevtools()],
  bootstrap: [App],
})
export class AppModule {}
