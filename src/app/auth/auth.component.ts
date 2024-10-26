import { Component, viewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthResponseData, AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent {
  isLogingMode = true;
  isLoading = false;
  error: string = null;
  authObs:Observable<AuthResponseData>;
  constructor(private auth: AuthService,private router:Router) {}
  onSwitchMode() {
    this.isLogingMode = !this.isLogingMode;
  }
  onSubmit(form: NgForm) {
    const email = form.value.email;
    const password = form.value.password;
    this.isLoading = true;
    if (!form.valid) {
      return;
    }
    if (this.isLogingMode) {

      this.authObs=this.auth.login(email,password);
    } else {
      this.authObs=this.auth.signup(email,password);
      
    }
    this.authObs.subscribe({
      next: (resData) => {
       console.log(resData);
        this.isLoading = false;
        this.router.navigate(['/recipes']);
      },
      error: (errorMessage) => {
       
        this.isLoading = false;
        this.error=errorMessage;
      },
    });
    //console.log(form.value);
    form.reset();
  }
  onHandleError(){
    this.error=null;
  }
}
