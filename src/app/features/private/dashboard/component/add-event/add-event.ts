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

    // Open confirmation dialog
    this.dialogService
      .openDeleteDialog(
        'Confirm Event Creation',
        'Are you sure you want to create this event?',
        'Create',
        'Cancel'
      )
      .subscribe((confirmed) => {
        if (confirmed) {
          const {
            title,
            category,
            description,
            location,
            totalTickets,
            price,
            schedule,
          } = this.eventForm.value;

          // Format the date to yyyy-mm-dd
          const dateObj = new Date(schedule.date);
          const formattedDate = dateObj.toISOString().split('T')[0];

          // Format time to hh:mm AM/PM
          const timeObj = new Date(`1970-01-01T${schedule.time}`);
          let hours = timeObj.getHours();
          const minutes = timeObj.getMinutes();
          const ampm = hours >= 12 ? 'PM' : 'AM';
          hours = hours % 12 || 12;
          const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')} ${ampm}`;

          const payload = {
            id: uuidv4(),
            title,
            category,
            description,
            location,
            totalTickets,
            price,
            date: formattedDate,
            time: formattedTime,
            availableTickets: totalTickets,
          };

          // Dispatch the event
          this.store.dispatch(addEvent({ event: payload }));

          // Show snackbar
          this.snackbar.open('✅ Event created', 'Close', {
            duration: 2000,
            panelClass: ['snackbar-success'],
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });

          this.eventForm.reset();
          this.router.navigate(['/admin/event/list']);
          this.nextId++;
        }
      });
  }
}
