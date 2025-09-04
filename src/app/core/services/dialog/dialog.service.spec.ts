import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { DialogService } from './dialog.service';
import { ConfirmationDialogComponent, ConfirmationDialogData } from '../confirmation-dialog/confirmation-dialog.component';

describe('DialogService', () => {
  let service: DialogService;
  let matDialogSpy: jasmine.SpyObj<MatDialog>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ConfirmationDialogComponent>>;

  beforeEach(() => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    dialogRefSpy.afterClosed.and.returnValue(of(true)); // simulate user click OK/confirm

    matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    matDialogSpy.open.and.returnValue(dialogRefSpy);

    TestBed.configureTestingModule({
      providers: [
        DialogService,
        { provide: MatDialog, useValue: matDialogSpy }
      ]
    });

    service = TestBed.inject(DialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open success dialog', (done) => {
    service.openSuccessDialog('Success', 'Operation completed').subscribe(result => {
      expect(result).toBeTrue();
      done();
    });

    expect(matDialogSpy.open).toHaveBeenCalledWith(ConfirmationDialogComponent, jasmine.objectContaining({
      width: '400px',
      data: jasmine.objectContaining({ title: 'Success', message: 'Operation completed', type: 'success' }),
      panelClass: 'success-dialog'
    }));
  });

  it('should open warning dialog', (done) => {
    service.openWarningDialog('Warning', 'Are you sure?').subscribe(result => {
      expect(result).toBeTrue();
      done();
    });

    expect(matDialogSpy.open).toHaveBeenCalledWith(ConfirmationDialogComponent, jasmine.objectContaining({
      width: '400px',
      data: jasmine.objectContaining({ title: 'Warning', message: 'Are you sure?', type: 'warning' }),
      panelClass: 'warning-dialog'
    }));
  });

  it('should open delete dialog', (done) => {
    service.openDeleteDialog('Delete', 'Do you want to delete?').subscribe(result => {
      expect(result).toBeTrue();
      done();
    });

    expect(matDialogSpy.open).toHaveBeenCalledWith(ConfirmationDialogComponent, jasmine.objectContaining({
      width: '400px',
      data: jasmine.objectContaining({ title: 'Delete', message: 'Do you want to delete?', type: 'delete' }),
      panelClass: 'delete-dialog'
    }));
  });

  it('should open info dialog', (done) => {
    service.openInfoDialog('Info', 'Some info message').subscribe(result => {
      expect(result).toBeTrue();
      done();
    });

    expect(matDialogSpy.open).toHaveBeenCalledWith(ConfirmationDialogComponent, jasmine.objectContaining({
      width: '400px',
      data: jasmine.objectContaining({ title: 'Info', message: 'Some info message', type: 'info' }),
      panelClass: 'info-dialog'
    }));
  });

  it('should open custom dialog', (done) => {
    const customData: ConfirmationDialogData = {
      title: 'Custom',
      message: 'Custom message',
      confirmText: 'Yes',
      cancelText: 'No',
      type: 'custom'
    };

    service.openCustomDialog(customData, '500px').subscribe(result => {
      expect(result).toBeTrue();
      done();
    });

    expect(matDialogSpy.open).toHaveBeenCalledWith(ConfirmationDialogComponent, jasmine.objectContaining({
      width: '500px',
      data: customData,
      panelClass: 'custom-dialog'
    }));
  });
});
