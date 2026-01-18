import { Component, inject, input } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { FormUtils } from '@auth/utils/form-utils';

@Component({
  selector: 'form-validator',
  imports: [],
  templateUrl: './form-validator.html',
})
export class FormValidator {
  control = input.required<AbstractControl>();
  formUtils = FormUtils;

  getErrors(){
    const errors: ValidationErrors = this.control()?.errors ?? {};

    return this.control()?.touched && Object.keys(errors).length > 0 ? FormUtils.getTextErrors(errors) : null;
  }
}
