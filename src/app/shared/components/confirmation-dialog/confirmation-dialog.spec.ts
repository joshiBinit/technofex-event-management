import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationDialogComponent } from './confirmation-dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';

describe('ConfirmationDialogComponent', () => {
  let component: ConfirmationDialogComponent;
  let fixture: ComponentFixture<ConfirmationDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ConfirmationDialogComponent>>;

  const mockData = {
    title: 'Delete Item',
    message: 'Are you sure you want to delete?',
  };

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [MatButtonModule, MatDialogModule],
      declarations: [ConfirmationDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockData },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should display title and message from data', () => {
    const titleEl: HTMLElement = fixture.debugElement.query(
      By.css('h2')
    ).nativeElement;
    const messageEl: HTMLElement = fixture.debugElement.query(
      By.css('mat-dialog-content p')
    ).nativeElement;

    expect(titleEl.textContent).toBe('Delete Item');
    expect(messageEl.textContent).toBe('Are you sure you want to delete?');
  });

  it('onConfirm() should close dialog with true', () => {
    component.onConfirm();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
  });

  it('onCancel() should close dialog with false', () => {
    component.onCancel();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(false);
  });

  it('should call onCancel() when Cancel button is clicked', () => {
    spyOn(component, 'onCancel');
    const cancelBtn = fixture.debugElement.queryAll(By.css('button'))[0];
    cancelBtn.triggerEventHandler('click', null);
    expect(component.onCancel).toHaveBeenCalled();
  });

  it('should call onConfirm() when Delete button is clicked', () => {
    spyOn(component, 'onConfirm');
    const deleteBtn = fixture.debugElement.queryAll(By.css('button'))[1];
    deleteBtn.triggerEventHandler('click', null);
    expect(component.onConfirm).toHaveBeenCalled();
  });
});
