import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormService } from '../../../../../core/services/form/form-service';
import { EventService } from '../../../../../core/services/event/event-service';
import { Router } from '@angular/router';

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
    private eventService: EventService
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
        id: this.nextId.toString(),
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
          this.router.navigate(['/admin/event/list']);
          this.nextId++;
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
