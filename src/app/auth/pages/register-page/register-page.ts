import { AfterViewInit, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '@auth/utils/form-utils';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-page',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './register-page.html',
})
export class RegisterPage implements AfterViewInit{
  private fb = inject(FormBuilder);
  formUtils = FormUtils;
  authService = inject(AuthService);
  router = inject(Router);

  errorMessage= signal<string>("");

  registerForm: FormGroup = this.fb.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.pattern(FormUtils.emailPattern)]],
    password: ['', [Validators.required]],
    password2: ['', [Validators.required]]
  }, {
    validators: [
      FormUtils.checkPasswordConsistency("password", "password2")
    ]
  }
  );

  ngAfterViewInit(): void {
    this.authService.errorExists.set(false);
  }

  onSubmit(){

    this.registerForm.markAllAsTouched();
    const {email, password, fullName} = this.registerForm.value;
    this.authService.register(email, password, fullName).subscribe((isAuthenticated)=>{
      if(isAuthenticated){
        this.router.navigateByUrl("/");
        return;
      }
    });
  }
 }
