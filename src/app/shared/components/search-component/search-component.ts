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
  @Input() debounceTime = 300; // ms
  @Input() placeholder = 'Search...';
  @Input() searchFields: string[] = [];
  
  @Output() searchChanged = new EventEmitter<string>();
  @Output() filteredData = new EventEmitter<any[]>();
  
  private _data: any[] = [];
  
  /**
   * Set the data to be searched
   * @param data Array of objects to search through
   */
  @Input() set data(data: any[]) {
    this._data = data || [];
    // If there's an active search term, apply it to the new data
    if (this.searchTerm && this._data.length > 0) {
      this.applyFilter();
    }
  }
  
  /**
   * Get the current data
   */
  get data(): any[] {
    return this._data;
  }

  /**
   * Handle search input with debouncing
   */
  onSearch(): void {
    // Clear any existing timeout to implement debouncing
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    
    // Set a new timeout
    this.searchTimeout = setTimeout(() => {
      this.searchChanged.emit(this.searchTerm);
      this.applyFilter();
    }, this.debounceTime);
  }
  
  /**
   * Clear the search term
   */
  clearSearch(): void {
    this.searchTerm = '';
    this.searchChanged.emit('');
    this.filteredData.emit([...this._data]);
  }
  
  /**
   * Apply filter to the data based on search term
   */
  private applyFilter(): void {
    const term = this.searchTerm.trim().toLowerCase();
    
    if (!term) {
      // If no search term, return all data
      this.filteredData.emit([...this._data]);
      return;
    }
    
    // If searchFields are provided, use them for filtering
    if (this.searchFields.length > 0) {
      const filtered = this._data.filter(item => {
        return this.searchFields.some(field => {
          const value = this.getNestedProperty(item, field);
          return value && value.toString().toLowerCase().includes(term);
        });
      });
      this.filteredData.emit(filtered);
    } else {
      // If no searchFields provided, search all string properties
      const filtered = this._data.filter(item => {
        return Object.keys(item).some(key => {
          const value = item[key];
          return typeof value === 'string' && value.toLowerCase().includes(term);
        });
      });
      this.filteredData.emit(filtered);
    }
  }
  
  /**
   * Get a nested property from an object using dot notation
   * @param obj The object to get the property from
   * @param path The path to the property (e.g. 'user.address.city')
   * @returns The value of the property or undefined if not found
   */
  private getNestedProperty(obj: any, path: string): any {
    return path.split('.').reduce((prev, curr) => {
      return prev ? prev[curr] : undefined;
    }, obj);
  }
}
