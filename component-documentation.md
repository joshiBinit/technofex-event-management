# Pagination and Search Components Documentation

## Overview

This document explains the enhanced pagination and search components that have been refactored to be reusable across the application. The logic for pagination and search has been moved from individual components into dedicated, reusable components.

## Pagination Component

### Location

`src/app/shared/components/pagination/pagination.ts`

### Features

- Handles all pagination logic internally
- Accepts data arrays and manages slicing for current page
- Maintains pagination state (page index, page size)
- Handles edge cases like empty pages
- Emits both page events and paginated data

### Usage

```html
<app-pagination #pagination [data]="yourDataArray" [showFirstLastButtons]="true" (page)="onPageChange($event)" (paginatedData)="onPaginatedDataChanged($event)" class="mt-4"> </app-pagination>
```

### Inputs

- `data`: The array of items to paginate
- `length`: Total number of items (optional, calculated from data if not provided)
- `pageSize`: Number of items per page (default: 10)
- `pageSizeOptions`: Available page size options (default: [5, 10, 25, 50])
- `showFirstLastButtons`: Whether to show first/last page buttons (default: true)
- `pageIndex`: Current page index (default: 0)

### Outputs

- `page`: Emits PageEvent when page changes
- `paginatedData`: Emits the sliced data for the current page

### Methods

- `setFilteredData(data: any[])`: Updates the data and resets pagination
- `onPageChange(event: PageEvent)`: Handles page change events

## Search Component

### Location

`src/app/shared/components/search-component/search-component.ts`

### Features

- Handles search logic with debouncing
- Filters data based on search term
- Supports searching specific fields or all string properties
- Includes clear search functionality
- Emits both search term and filtered data

### Usage

```html
<app-search-component [data]="yourDataArray" [searchFields]="['title', 'description', 'category']" [placeholder]="'Search by title, category...'" (searchChanged)="onSearchChanged($event)" (filteredData)="onFilteredDataChanged($event)"> </app-search-component>
```

### Inputs

- `data`: The array of items to search through
- `searchFields`: Specific fields to search (if empty, searches all string properties)
- `placeholder`: Placeholder text for the search input
- `debounceTime`: Debounce time in milliseconds (default: 300)

### Outputs

- `searchChanged`: Emits the search term when it changes
- `filteredData`: Emits the filtered data based on the search term

### Methods

- `onSearch()`: Handles search input with debouncing
- `clearSearch()`: Clears the search term and resets filtered data
- `applyFilter()`: Applies the filter to the data

## Integration Example

Here's how to integrate both components in a parent component:

### Parent Component TS

```typescript
import { Component, OnInit, ViewChild } from "@angular/core";
import { Pagination } from "../../../shared/components/pagination/pagination";

@Component({
  selector: "app-parent",
  templateUrl: "./parent.html",
})
export class ParentComponent implements OnInit {
  allData: any[] = [];
  displayedData: any[] = [];
  searchFields: string[] = ["name", "description"];

  @ViewChild("pagination") paginationComponent: Pagination;

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.dataService.getData().subscribe((data) => {
      this.allData = data;
    });
  }

  onSearchChanged(searchTerm: string): void {
    console.log("Search term:", searchTerm);
  }

  onFilteredDataChanged(data: any[]): void {
    if (this.paginationComponent) {
      this.paginationComponent.setFilteredData(data);
    }
  }

  onPaginatedDataChanged(data: any[]): void {
    this.displayedData = data;
  }

  onPageChange(event: PageEvent): void {
    console.log("Page changed:", event);
    // Additional logic if needed
  }
}
```

### Parent Component HTML

```html
<div>
  <h1>Data List</h1>

  <app-search-component [data]="allData" [searchFields]="searchFields" [placeholder]="'Search...'" (searchChanged)="onSearchChanged($event)" (filteredData)="onFilteredDataChanged($event)"> </app-search-component>

  <!-- Your data display (table, cards, etc.) -->
  <div *ngFor="let item of displayedData">{{ item.name }}</div>

  <app-pagination #pagination [data]="allData" [showFirstLastButtons]="true" (page)="onPageChange($event)" (paginatedData)="onPaginatedDataChanged($event)" class="mt-4"> </app-pagination>
</div>
```

## Benefits

1. **Reusability**: These components can be used across the application wherever pagination or search is needed.
2. **Separation of Concerns**: Pagination and search logic is encapsulated in dedicated components.
3. **Maintainability**: Changes to pagination or search logic only need to be made in one place.
4. **Consistency**: Ensures consistent behavior and appearance of pagination and search throughout the application.
5. **Reduced Boilerplate**: Parent components don't need to implement pagination or search logic.
