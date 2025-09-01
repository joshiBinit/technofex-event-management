import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../../../../shared/model/user.model';
import { UserService } from '../../../../../core/services/users/user-service';

@Component({
  selector: 'app-user-component',
  standalone: false,
  templateUrl: './user-component.html',
  styleUrl: './user-component.scss',
})
export class UserComponent {
  users: User[] = [];

  private userService = inject(UserService);

  displayedColumns: string[] = ['username', 'email', 'role'];

  ngOnInit(): void {
    this.userService.getUsers().subscribe((data) => {
      this.users = data;
    });
  }
}
