import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-search-component',
  standalone: false,
  templateUrl: './search-component.html',
  styleUrl: './search-component.scss',
})
export class SearchComponent {
  searchTerm: string = '';
  private searchTimeout: any;
  @Input() debounceTime = 300;
  @Input() placeholder = 'Search...';
  @Input() searchFields: string[] = [];

  @Output() searchChanged = new EventEmitter<string>();
  @Output() filteredData = new EventEmitter<any[]>();

  private _data: any[] = [];

  @Input() set data(data: any[]) {
    this._data = data || [];
    if (this.searchTerm && this._data.length > 0) {
      this.applyFilter();
    }
  }

  get data(): any[] {
    return this._data;
  }

  onSearch(): void {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = setTimeout(() => {
      this.searchChanged.emit(this.searchTerm);
      this.applyFilter();
    }, this.debounceTime);
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.searchChanged.emit('');
    this.filteredData.emit([...this._data]);
  }

  private applyFilter(): void {
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) {
      this.filteredData.emit([...this._data]);
      return;
    }

    if (this.searchFields.length > 0) {
      const filtered = this._data.filter((item) => {
        return this.searchFields.some((field) => {
          const value = this.getNestedProperty(item, field);
          return value && value.toString().toLowerCase().includes(term);
        });
      });
      this.filteredData.emit(filtered);
    } else {
      const filtered = this._data.filter((item) => {
        return Object.keys(item).some((key) => {
          const value = item[key];
          return (
            typeof value === 'string' && value.toLowerCase().includes(term)
          );
        });
      });
      this.filteredData.emit(filtered);
    }
  }

  private getNestedProperty(obj: any, path: string): any {
    return path.split('.').reduce((prev, curr) => {
      return prev ? prev[curr] : undefined;
    }, obj);
  }
}
