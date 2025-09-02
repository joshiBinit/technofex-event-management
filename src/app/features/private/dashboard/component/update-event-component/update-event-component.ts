import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormService } from '../../../../../core/services/form/form-service';
import { EventService } from '../../../../../core/services/event/event-service';
import { Event } from '../../../../../shared/model/event.model';

@Component({
  selector: 'app-update-event-component',
  standalone: false,
  templateUrl: './update-event-component.html',
  styleUrls: ['./update-event-component.scss'],
})
export class UpdateEventComponent implements OnInit {
  eventForm!: FormGroup;
  locations: string[] = [];
  eventId!: string; // <-- changed to string

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formService: FormService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.eventForm = this.formService.buildNewEventForm();
    this.loadLocations();

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.eventId = id; // <-- keep as string
        this.loadEvent(this.eventId);
      }
    });
  }

  loadLocations() {
    this.eventService.loadLocations().subscribe({
      next: (data) => {
        this.locations = data.map((loc) => loc.name);
      },
      error: (err) => console.error('Failed to load locations:', err),
    });
  }

  loadEvent(id: string) {
    // <-- parameter is string
    this.eventService.getEventById(id).subscribe({
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
    if (this.eventForm.valid) {
      const formValue = this.eventForm.value;

      const payload: Event = {
        id: this.eventId, // <-- string now
        title: formValue.title,
        category: formValue.category,
        description: formValue.description,
        date: formValue.schedule.date
          ? formValue.schedule.date.toISOString().split('T')[0]
          : '',
        time: formValue.schedule.time,
        location: formValue.location,
        totalTickets: formValue.totalTickets,
        price: formValue.price,
      };

      this.eventService.updateEvent(this.eventId, payload).subscribe({
        next: () => {
          alert('Event updated successfully!');
          this.router.navigate(['/admin/event/list']);
        },
        error: (err) => {
          console.error('Failed to update event:', err);
          alert('Failed to update event. Please try again.');
        },
      });
    } else {
      this.eventForm.markAllAsTouched();
    }
  }
}
