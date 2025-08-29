import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [App],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [provideBrowserGlobalErrorListeners(), provideStoreDevtools()],
  bootstrap: [App],
})
export class AppModule {}
