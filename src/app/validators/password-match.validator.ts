import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const password = control.get('password')?.value;
  const passwordRepeat = control.get('password_repeat')?.value;
  return password === passwordRepeat ? null : { mismatch: true };
};
