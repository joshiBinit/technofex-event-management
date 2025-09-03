import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { PaginationComponent } from './pagination';
// import { ComponentFixture, TestBed } from '@angular/core/testing';

// import { Pagination } from './pagination';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;
  // describe('Pagination', () => {
  //   let component: Pagination;
  //   let fixture: ComponentFixture<Pagination>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatPaginatorModule],
      declarations: [PaginationComponent],
    }).compileComponents();
    //   beforeEach(async () => {
    //     await TestBed.configureTestingModule({
    //       declarations: [Pagination]
    //     })
    //     .compileComponents();

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    component.data = Array.from({ length: 20 }, (_, i) => ({ id: i + 1 }));
    fixture.detectChanges();
  });
  //     fixture = TestBed.createComponent(Pagination);
  //     component = fixture.componentInstance;
  //     fixture.detectChanges();
  //   });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit first page data on init', () => {
    spyOn(component.paginatedData, 'emit');
    component.ngOnInit();
    expect(component.paginatedData.emit).toHaveBeenCalled();
    expect(component.paginatedData.emit).toHaveBeenCalledWith(
      component.data.slice(0, component.pageSize)
    );
  });

  it('should update paginated data on page change', () => {
    spyOn(component.paginatedData, 'emit');
    const event: PageEvent = { pageIndex: 1, pageSize: 5, length: 20 };
    component.onPageChange(event);
    expect(component.pageIndex).toBe(1);
    expect(component.paginatedData.emit).toHaveBeenCalledWith(
      component.data.slice(5, 10)
    );
  });

  it('should handle filtered data', () => {
    spyOn(component.paginatedData, 'emit');
    const filtered = component.data.slice(0, 3);
    component.setFilteredData(filtered);
    expect(component.paginatedData.emit).toHaveBeenCalledWith(filtered);
    expect(component.length).toBe(3);
    expect(component.pageIndex).toBe(0);
  });
});
//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
