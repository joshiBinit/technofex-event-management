import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing-module';
import { LoginComponent } from './component/login-component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, RouterOutlet } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { loginReducer } from './store/login-component.reducer';
import { LoginEffects } from './store/login-component.effects';


@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    RouterOutlet,
    StoreModule.forFeature('login', loginReducer),
    EffectsModule.forFeature([LoginEffects]),
    LoginRoutingModule
  ]
})
export class LoginModule { }
