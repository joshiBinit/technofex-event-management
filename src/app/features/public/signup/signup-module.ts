import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SignupRoutingModule } from './signup-routing-module';
import { SignupComponent } from './component/signup-component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { SignupEffects } from './store/signup-component.effects';
import { signupReducer } from './store/signup-component.reducer';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    SignupComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    StoreModule.forFeature('signup', signupReducer),  // <-- feature store
    EffectsModule.forFeature([SignupEffects]),
    SignupRoutingModule
  ]
})
export class SignupModule { }
