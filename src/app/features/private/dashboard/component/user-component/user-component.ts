import { Component, OnDestroy, inject } from '@angular/core';
import { User } from '../../../../../shared/model/user.model';
import { UserService } from '../../../../../core/services/users/user-service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-user-component',
  standalone: false,
  templateUrl: './user-component.html',
  styleUrls: ['./user-component.scss'],
})
export class UserComponent implements OnDestroy {
  users: User[] = [];
  displayedColumns: string[] = ['username', 'email', 'role'];

  private userService = inject(UserService);
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.userService
      .getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.users = data.filter((user) => user.role === 'user');
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
