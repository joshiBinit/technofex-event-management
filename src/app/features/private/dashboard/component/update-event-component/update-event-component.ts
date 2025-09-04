import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormService } from '../../../../../core/services/form/form-service';
import { EventService } from '../../../../../core/services/event/event-service';
import { Event } from '../../../../../shared/model/event.model';

import { Subject, takeUntil } from 'rxjs';
import { DialogService } from '../../../../../core/services/dialog/dialog.service';
import { SnackbarService } from '../../../../../shared/services/snackbar/snackbar-service';

@Component({
  selector: 'app-update-event-component',
  standalone: false,
  templateUrl: './update-event-component.html',
  styleUrls: ['./update-event-component.scss'],
})
export class UpdateEventComponent implements OnInit, OnDestroy {
  eventForm!: FormGroup;
  locations: string[] = [];
  eventId!: string;

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formService: FormService,
    private eventService: EventService,
    private dialogService: DialogService,
    private snackbar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.eventForm = this.formService.buildNewEventForm();
    this.loadLocations();

    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.eventId = id;
        this.loadEvent(this.eventId);
      }
    });
  }

  loadLocations() {
    this.eventService
      .loadLocations()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.locations = data.map((loc) => loc.name);
        },
        error: (err) => console.error('Failed to load locations:', err),
      });
  }

  loadEvent(id: string) {
    this.eventService
      .getEventById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (event) => {
          if (event) {
            if (event.location && !this.locations.includes(event.location)) {
              this.locations.push(event.location);
            }

            this.eventForm.patchValue({
              title: event.title,
              category: event.category,
              description: event.description,
              schedule: {
                date: event.date ? new Date(event.date) : null,
                time: event.time,
              },
              location: event.location,
              totalTickets: event.totalTickets,
              price: event.price,
            });
          }
        },
        error: (err) => console.error('Failed to load event:', err),
      });
  }

  onSubmit() {
    if (!this.eventForm.valid) {
      this.eventForm.markAllAsTouched();
      return;
    }

    const formValue = this.eventForm.value;

    this.dialogService
      .openDeleteDialog(
        'Confirm Event Update',
        'Are you sure you want to update this event?',
        'Update',
        'Cancel'
      )
      .subscribe((confirmed) => {
        if (!confirmed) return;

        this.eventService
          .getEventById(this.eventId)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (currentEvent) => {
              if (!currentEvent) return;

              const bookedTickets =
                currentEvent.totalTickets -
                (currentEvent.availableTickets ?? currentEvent.totalTickets);

              const updatedAvailableTickets =
                formValue.totalTickets - bookedTickets;

              const payload: Event = {
                id: this.eventId,
                title: formValue.title,
                category: formValue.category,
                description: formValue.description,
                date: formValue.schedule.date
                  ? formValue.schedule.date.toISOString().split('T')[0]
                  : '',
                time: formValue.schedule.time,
                location: formValue.location,
                totalTickets: formValue.totalTickets,
                availableTickets: updatedAvailableTickets,
                price: formValue.price,
              };

              this.eventService
                .updateEvent(this.eventId, payload)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                  next: () => {
                    this.snackbar.show(
                      '✅ Event updated successfully',
                      'Close'
                    );
                    this.router.navigate(['/admin/event/list']);
                  },
                  error: (err) => {
                    console.error('Failed to update event:', err);
                    this.snackbar.show(
                      '❌ Failed to update event. Please try again.',
                      'Close'
                    );
                  },
                });
            },
            error: (err) =>
              console.error('Failed to fetch current event:', err),
          });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
