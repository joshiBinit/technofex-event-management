import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.html',
  standalone: false,
  styleUrls: ['./pagination.scss'],
})
export class PaginationComponent implements OnInit {
  /** Inputs */
  @Input() data: any[] = [];
  @Input() length = 0;
  @Input() pageSize = 10;
  @Input() pageIndex = 0;
  @Input() pageSizeOptions: number[] = [5, 10, 25, 50];
  @Input() showFirstLastButtons = true;

  /** Outputs */
  @Output() page = new EventEmitter<PageEvent>();
  @Output() paginatedData = new EventEmitter<any[]>();

  /** Internal state */
  private filteredData: any[] = [];

  ngOnInit(): void {
    // Ensure current pageSize is included in options
    if (!this.pageSizeOptions.includes(this.pageSize)) {
      this.pageSizeOptions = [...this.pageSizeOptions, this.pageSize].sort((a, b) => a - b);
    }

    // ✅ Always initialize filteredData with the full dataset
    this.filteredData = [...this.data];
    this.length = this.length || this.data.length;

    // ✅ Emit first page immediately (even if no search yet)
    this.updatePaginatedData();
  }

  /** Handle page change */
  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.length = this.filteredData.length;

    this.updatePaginatedData();
    this.page.emit(event);
  }

  /** Update filtered dataset (used when searching/filtering) */
  setFilteredData(data: any[]): void {
    this.filteredData = data.length > 0 ? [...data] : [...this.data]; // ✅ fallback to all data if empty search
    this.length = this.filteredData.length;
    this.pageIndex = 0;
    this.updatePaginatedData();
  }

  /** Emit current page data */
  private updatePaginatedData(): void {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;

    let pageItems = this.filteredData.slice(start, end);

    // Prevent empty page if data exists
    if (pageItems.length === 0 && this.filteredData.length > 0 && this.pageIndex > 0) {
      this.pageIndex = Math.max(0, Math.ceil(this.filteredData.length / this.pageSize) - 1);
      return this.updatePaginatedData();
    }

    this.paginatedData.emit(pageItems);
  }
}
