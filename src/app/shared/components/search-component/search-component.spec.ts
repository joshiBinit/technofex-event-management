import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { SearchComponent } from './search-component';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, MatFormFieldModule, MatInputModule, MatIconModule],
      declarations: [SearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    component.data = [
      { name: 'Alice', email: 'alice@test.com' },
      { name: 'Bob', email: 'bob@test.com' },
    ];
    component.searchFields = ['name', 'email'];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit filtered data on search', fakeAsync(() => {
    spyOn(component.filteredData, 'emit');

    component.searchTerm = 'Alice';
    component.onSearch();
    tick(component.debounceTime);

    expect(component.filteredData.emit).toHaveBeenCalledWith([
      { name: 'Alice', email: 'alice@test.com' },
    ]);
  }));

  it('should emit all data when search term is cleared', () => {
    spyOn(component.filteredData, 'emit');

    component.searchTerm = 'Alice';
    component.clearSearch();

    expect(component.searchTerm).toBe('');
    expect(component.filteredData.emit).toHaveBeenCalledWith(component.data);
  });

  it('should handle nested property search', fakeAsync(() => {
    component.data = [{ user: { name: 'Charlie' }, email: 'charlie@test.com' }];
    component.searchFields = ['user.name'];
    spyOn(component.filteredData, 'emit');

    component.searchTerm = 'Charlie';
    component.onSearch();
    tick(component.debounceTime);

    expect(component.filteredData.emit).toHaveBeenCalledWith([
      { user: { name: 'Charlie' }, email: 'charlie@test.com' },
    ]);
  }));
});
