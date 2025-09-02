import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-pagination',
  standalone: false,
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss'
})
export class Pagination implements OnInit {
  @Input() length = 0;
  @Input() pageSize = 10;
  @Input() pageSizeOptions: number[] = [5, 10, 25, 50];
  @Input() showFirstLastButtons = true;
  @Input() pageIndex = 0;
  
  @Output() page = new EventEmitter<PageEvent>();
  
  ngOnInit(): void {
    // Initialize with default values if none provided
    if (!this.pageSizeOptions.includes(this.pageSize)) {
      this.pageSizeOptions.push(this.pageSize);
      this.pageSizeOptions.sort((a, b) => a - b);
    }
  }
  
  /**
   * Handle page events from the paginator
   * @param event The page event containing pageIndex, pageSize, etc.
   */
  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.page.emit(event);
  }
}
