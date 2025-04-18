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

  constructor(private router: Router){}

  onSubmit(){
    this.router.navigate(['/dashboard'])

    console.log('Email: ', this.email);
    console.log('Password: ', this.password);
  }
}
