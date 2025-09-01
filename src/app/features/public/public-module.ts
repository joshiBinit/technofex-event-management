import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { SignupEffects } from './signup/store/signup-component.effects';
import { signupReducer } from './signup/store/signup-component.reducer';
import { ReactiveFormsModule } from '@angular/forms';

import { PublicRoutingModule } from './public-routing-module';
import { SignupComponent } from './signup/component/signup-component';
import { LoginComponent } from './login/component/login-component';
import { LoginEffects } from './login/store/login-component.effects';
import { loginReducer } from './login/store/login-component.reducer';

@NgModule({
  declarations: [SignupComponent, LoginComponent],
  imports: [
    PublicRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    StoreModule.forFeature('signup', signupReducer),
    StoreModule.forFeature('login', loginReducer),
    EffectsModule.forFeature([SignupEffects, LoginEffects]),
  ],
})
export class PublicModule {}
