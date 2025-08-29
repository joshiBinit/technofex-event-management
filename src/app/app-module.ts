import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { RouterOutlet } from '@angular/router';

@NgModule({
  declarations: [App],
  imports: [BrowserModule, AppRoutingModule, RouterOutlet],
  providers: [provideBrowserGlobalErrorListeners(), provideStoreDevtools()],
  bootstrap: [App],
})
export class AppModule {}
