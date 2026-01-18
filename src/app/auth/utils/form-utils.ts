import { AbstractControl, FormGroup, ValidationErrors } from "@angular/forms";

export class FormUtils{
  static emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  static noSpacesPattern = '^[a-zA-Z0-9]+$';
  static slugPattern = '^[a-z0-9_]+(?:-[a-z0-9_]+)*$';

 static fieldValidator(form: FormGroup, fieldName: string){
    return (
      form.controls[fieldName].errors &&
      form.controls[fieldName].touched
    )
  }

  static getFieldErrors(form: FormGroup, fieldName: string){

    const errors = form.controls[fieldName].errors ?? {};

    this.getTextErrors(errors);

  }

  static checkPasswordConsistency(passwordControl1:string, passwordControl2:string){

    // El AbstractControl se refiere al FormGroup en el cuál está definido el validators, dentro del objeto de opciones (Mirar register-page.ts)
    return (form: AbstractControl)=>{

      const password1 = form.get(passwordControl1)?.value;
      const password2 = form.get(passwordControl2)?.value;

      return password1 === password2 ? null : { passwordNotEqual: true };

    }


  }
  static getTextErrors(errors: ValidationErrors){
    for(const key of Object.keys(errors)){
      switch(key){
        case "required": return "Este campo es requerido";
        case "pattern": return "El email no es válido";
        case "passwordNotEqual": return "Las contraseñas deben coincidir.";
        case "min": return "El número no puede ser menor que cero.";
      }
  }
  return null;
}
}
