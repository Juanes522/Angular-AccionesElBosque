import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-component',
  templateUrl: './login-component.component.html',
  styleUrls: ['./login-component.component.css']
})

export class LoginComponentComponent {
  email: string = '';
  password: string = '';

  constructor(
    private router: Router
  ){}

  isLoading: boolean = false;
  onSubmit() {
    this.isLoading = true;

    console.log('Credenciales ingresadas:', { email: this.email, password: this.password });
    
    setTimeout(() => {
      this.router.navigate(['/mfa-verify']);
      this.isLoading = false;
    }, 1000);
  }
}
