import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormService } from '../../../../../core/services/form/form-service';
import { EventService } from '../../../../../core/services/event/event-service';

@Component({
  selector: 'app-add-event',
  standalone: false,
  templateUrl: './add-event.html',
  styleUrl: './add-event.scss',
})
export class AddEventComponent {
  eventForm!: FormGroup;

  constructor(
    private formService: FormService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.eventForm = this.formService.buildNewEventForm();
  }

  onSubmit() {
    if (this.eventForm.valid) {
      const {
        title,
        category,
        description,
        location,
        totalTickets,
        price,
        schedule,
      } = this.eventForm.value;

      const payload = {
        title,
        category,
        description,
        location,
        totalTickets,
        price,
        date: schedule.date,
        time: schedule.time,
      };

      this.eventService.addEvent(payload).subscribe({
        next: (event) => {
          console.log('Event added successfully:', event);
          alert('Event created successfully!');
          this.eventForm.reset();
        },
        error: (err) => {
          console.error('Error adding event:', err);
          alert('Failed to add event. Please try again.');
        },
      });
    } else {
      this.eventForm.markAllAsTouched();
    }
  }
}
