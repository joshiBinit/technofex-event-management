import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormService } from '../../../../../core/services/form/form-service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { addEvent } from '../../store/dashboard-event/dashboard-event.action';

import { Observable, Subject, takeUntil } from 'rxjs';
import { selectAllLocations } from '../../../../../shared/store/location/location.selector';
import { Location } from '../../../../../shared/model/event.model';
import { loadLocations } from '../../../../../shared/store/location/location.action';
import { DialogService } from '../../../../../core/services/dialog/dialog.service';
import { buildEventPayload } from '../../utils/event-utils';
import { SnackbarService } from '../../../../../shared/services/snackbar/snackbar-service';
import { signupForm } from '../../../../../core/services/form/form.utils';

@Component({
  selector: 'app-add-event',
  standalone: false,
  templateUrl: './add-event.html',
  styleUrl: './add-event.scss',
})
export class AddEventComponent implements OnInit, OnDestroy {
  eventForm!: FormGroup;
  locations$: Observable<Location[]>;
  nextId = 10;

  #destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private formService: FormService,
    private snackbarService: SnackbarService,
    private dialogService: DialogService,
    private store: Store,
    private readonly fb: FormBuilder
  ) {
    this.locations$ = this.store.select(selectAllLocations);
  }

  // get eventForm(): FormGroup | undefined {
  //   return this.formService.form;
  // }

  ngOnInit(): void {
    setTimeout(() => {
      this.eventForm = signupForm(this.fb);
    }, 2000);
    this.loadLocations();
  }

  ngOnDestroy(): void {
    this.#destroy$.next();
    this.#destroy$.complete();
  }

  loadLocations() {
    this.store.dispatch(loadLocations());
  }

  onSubmit() {
    if (!this.eventForm?.valid) {
      this.eventForm?.markAllAsTouched();
      return;
    }

    this.dialogService
      .openDeleteDialog(
        'Confirm Event Creation',
        'Are you sure you want to create this event?',
        'Create',
        'Cancel'
      )
      .pipe(takeUntil(this.#destroy$))
      .subscribe((confirmed) => {
        if (confirmed) {
          const payload = buildEventPayload(this.eventForm?.value);
          this.store.dispatch(addEvent({ event: payload }));

          this.snackbarService.show('✅ Event created', 'success');

          this.eventForm?.reset();
          this.router.navigate(['/event/list']);
          this.nextId++;
        }
      });
  }
}
