# Dynamic Pagination Component

A reusable Angular Material pagination component that can be easily integrated into any component that requires pagination functionality.

## Features

- Built on Angular Material's MatPaginator
- Configurable page size options
- First/last page navigation buttons
- Event emitter for page changes
- Easy to integrate with any data source

## Usage

### 1. Import the SharedModule

The pagination component is part of the SharedModule. Make sure to import it in your feature module:

```typescript
import { SharedModule } from 'path/to/shared/shared-module';

@NgModule({
  imports: [
    SharedModule,
    // other imports
  ],
  // ...
})
export class YourFeatureModule { }
```

### 2. Use the Component in Your Template

```html
<app-pagination
  [length]="totalItems"
  [pageSize]="pageSize"
  [pageSizeOptions]="[5, 10, 25, 50]"
  [showFirstLastButtons]="true"
  (page)="onPageChange($event)">
</app-pagination>
```

### 3. Handle Page Events in Your Component

```typescript
import { PageEvent } from '@angular/material/paginator';

// ...

export class YourComponent {
  // Your data array
  allData: any[] = [];
  
  // Pagination properties
  displayedData: any[] = [];
  pageSize = 10;
  pageIndex = 0;
  totalItems = 0;
  
  // ...
  
  /**
   * Handle page changes from the paginator
   */
  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.updateDisplayedData();
  }
  
  /**
   * Update the displayed data based on current page and page size
   */
  updateDisplayedData(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    
    // Slice the data array to get only the items for current page
    this.displayedData = this.allData.slice(startIndex, endIndex);
  }
}
```

## API Reference

### Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| length | number | 0 | The total number of items to be paginated |
| pageSize | number | 10 | Number of items to display on a page |
| pageSizeOptions | number[] | [5, 10, 25, 50] | The set of provided page size options |
| showFirstLastButtons | boolean | true | Whether to show the first/last buttons |
| pageIndex | number | 0 | The zero-based page index of the displayed page |

### Outputs

| Name | Type | Description |
|------|------|-------------|
| page | EventEmitter<PageEvent> | Event emitted when the paginator changes the page size or page index |

## Example

See the `pagination-example.ts` component for a complete example of how to use the pagination component with a data source.