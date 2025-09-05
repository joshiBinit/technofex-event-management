import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormService } from '../../../../../core/services/form/form-service';
import { EventService } from '../../../../../core/services/event/event-service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { addEvent } from '../../store/dashboard-event/dashboard-event.action';
import { v4 as uuidv4 } from 'uuid';
import { DialogService } from '../../../../../core/services/dialog/dialog.service';
import { format } from 'date-fns';
import { buildEventPayload } from '../../utils/event-utils';

@Component({
  selector: 'app-add-event',
  standalone: false,
  templateUrl: './add-event.html',
  styleUrl: './add-event.scss',
})
export class AddEventComponent {
  eventForm!: FormGroup;
  locations: string[] = [];
  nextId = 10;

  constructor(
    private router: Router,
    private formService: FormService,
    private eventService: EventService,
    private snackbar: MatSnackBar,
    private dialogService: DialogService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.eventForm = this.formService.buildNewEventForm();
    this.loadLocations();
  }

  loadLocations() {
    this.eventService.loadLocations().subscribe({
      next: (data) => {
        this.locations = data.map((loc) => loc.name);
      },
      error: (err) => console.error('Failed to load locations:', err),
    });
  }

  onSubmit() {
    if (!this.eventForm.valid) {
      this.eventForm.markAllAsTouched();
      return;
    }

    this.dialogService
      .openDeleteDialog(
        'Confirm Event Creation',
        'Are you sure you want to create this event?',
        'Create',
        'Cancel'
      )
      .subscribe((confirmed) => {
        if (confirmed) {
          const payload = buildEventPayload(this.eventForm.value);
          this.store.dispatch(addEvent({ event: payload }));

          this.snackbar.open('✅ Event created', 'Close', {
            duration: 2000,
            panelClass: ['snackbar-success'],
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });

          this.eventForm.reset();
          this.router.navigate(['/event/list']);
          this.nextId++;
        }
      });
  }
}
