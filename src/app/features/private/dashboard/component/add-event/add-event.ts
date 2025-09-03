import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormService } from '../../../../../core/services/form/form-service';
import { EventService } from '../../../../../core/services/event/event-service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { addEvent } from '../../store/dashboard-event/dashboard-event.action';
import { v4 as uuidv4 } from 'uuid';
import { Observable } from 'rxjs';
import { selectAllLocations } from '../../../../../shared/store/location/location.selector';
import { Location } from '../../../../../shared/model/event.model';
import { loadLocations } from '../../../../../shared/store/location/location.action';
@Component({
  selector: 'app-add-event',
  standalone: false,
  templateUrl: './add-event.html',
  styleUrl: './add-event.scss',
})
export class AddEventComponent {
  eventForm!: FormGroup;
  locations$: Observable<Location[]>;
  nextId = 10;

  constructor(
    private router: Router,
    private formService: FormService,
    private eventService: EventService,
    private snackbar: MatSnackBar,
    private store: Store
  ) {
    this.locations$ = this.store.select(selectAllLocations);
  }

  ngOnInit(): void {
    this.eventForm = this.formService.buildNewEventForm();
    this.loadLocations();
  }

  loadLocations() {
    this.store.dispatch(loadLocations());
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
        id: uuidv4(),
        title,
        category,
        description,
        location,
        totalTickets,
        price,
        date: schedule.date,
        time: schedule.time,
      };
      this.store.dispatch(addEvent({ event: payload }));

      this.snackbar.open('✅ Event creation in progress', 'Close', {
        duration: 2000,
        panelClass: ['snackbar-success'],
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });

      this.eventForm.reset();
      this.router.navigate(['/admin/event/list']);
      this.nextId++;
    } else {
      this.eventForm.markAllAsTouched();
    }
  }
}
