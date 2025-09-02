# Pagination Component Usage Guide

## Quick Start

### Step 1: Import the SharedModule

In your feature module:

```typescript
import { SharedModule } from 'src/app/shared/shared-module';

@NgModule({
  imports: [
    SharedModule,
    // other imports
  ],
  // ...
})
export class YourFeatureModule { }
```

### Step 2: Add the component to your template

```html
<app-pagination
  [length]="totalItems"
  [pageSize]="pageSize"
  (page)="onPageChange($event)">
</app-pagination>
```

### Step 3: Handle pagination in your component

```typescript
import { PageEvent } from '@angular/material/paginator';

// ...

export class YourComponent {
  // Your data
  items: any[] = [];
  displayedItems: any[] = [];
  
  // Pagination settings
  totalItems = 0;
  pageSize = 10;
  pageIndex = 0;
  
  // Load your data
  loadData() {
    // Get your data from a service
    this.dataService.getData().subscribe(data => {
      this.items = data;
      this.totalItems = this.items.length;
      this.updateDisplayedItems();
    });
  }
  
  // Handle page changes
  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDisplayedItems();
  }
  
  // Update displayed items based on current page
  updateDisplayedItems() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedItems = this.items.slice(startIndex, endIndex);
  }
}
```

## Working with Server-Side Pagination

For server-side pagination, modify your approach:

```typescript
export class ServerPaginationComponent {
  displayedItems: any[] = [];
  totalItems = 0;
  pageSize = 10;
  pageIndex = 0;
  
  constructor(private dataService: YourDataService) {
    this.loadPage(0, this.pageSize);
  }
  
  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadPage(this.pageIndex, this.pageSize);
  }
  
  loadPage(pageIndex: number, pageSize: number) {
    this.dataService.getPagedData(pageIndex, pageSize).subscribe(response => {
      this.displayedItems = response.items;
      this.totalItems = response.totalCount;
    });
  }
}
```

## Example

Check out the working example at `/shared/pagination-example` in the application.