import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-search-component',
  standalone: false,
  templateUrl: './search-component.html',
  styleUrl: './search-component.scss',
})
export class SearchComponent {
  searchTerm: string = '';

  @Output() searchChanged = new EventEmitter<string>();

  onSearch(): void {
    this.searchChanged.emit(this.searchTerm);
  }
}
