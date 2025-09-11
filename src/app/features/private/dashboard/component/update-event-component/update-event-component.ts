import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormService } from '../../../../../core/services/form/form-service';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { DialogService } from '../../../../../core/services/dialog/dialog.service';
import * as EventsActions from '../../../events/store/events/event.action';
import * as EventsSelectors from '../../../events/store/events/event.selector';
import * as LocationsActions from '../../../../../shared/store/location/location.action';
import * as LocationsSelectors from '../../../../../shared/store/location/location.selector';
import { updateEventPayload, patchEventForm } from '../../utils/event-utils';

@Component({
  selector: 'app-update-event-component',
  standalone: false,
  templateUrl: './update-event-component.html',
  styleUrls: ['./update-event-component.scss'],
})
export class UpdateEventComponent implements OnInit, OnDestroy {
  locations$: Observable<any>;
  eventForm: FormGroup;
  eventId: string = '';

  private destroy$ = new Subject<void>();

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private formService: FormService,
    private dialogService: DialogService
  ) {
    this.locations$ = this.store.select(LocationsSelectors.selectAllLocations);
    this.eventForm = this.formService.buildNewEventForm();
  }

  ngOnInit(): void {
    this.store.dispatch(LocationsActions.loadLocations());

    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.eventId = id;
        this.store
          .select(EventsSelectors.selectEventById(id))
          .pipe(takeUntil(this.destroy$))
          .subscribe((event) => {
            if (event) patchEventForm(this.eventForm, event);
          });
      }
    });

    this.store
      .select(EventsSelectors.selectEventLoading)
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  onSubmit(): void {
    if (!this.eventForm.valid) {
      this.eventForm.markAllAsTouched();
      return;
    }

    this.dialogService
      .openDeleteDialog(
        'Confirm Event Update',
        'Are you sure you want to update this event?',
        'Update',
        'Cancel'
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((confirmed) => {
        if (!confirmed) return;
        const formValue = this.eventForm.value;
        const payload = updateEventPayload(this.eventId, formValue);
        this.store.dispatch(EventsActions.updateEvent({ event: payload }));
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
