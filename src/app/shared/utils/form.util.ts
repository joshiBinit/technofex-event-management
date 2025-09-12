import { FormGroup } from '@angular/forms';

export function utilHasError(
  form: FormGroup,
  controlName: string,
  errorCode: string
): boolean {
  const control = form.get(controlName);
  return !!(control && control.touched && control.hasError(errorCode));
}
