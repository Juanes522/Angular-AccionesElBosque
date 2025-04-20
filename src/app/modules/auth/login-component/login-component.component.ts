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
  recoveryEmail: string = '';
  isLoading: boolean = false;
  showRecovery: boolean = false;

  constructor(
    private router: Router
  ){}

  toggleRecovery(){
    this.showRecovery = !this.showRecovery;
  }

  onSubmit() {
    this.isLoading = true;

    console.log('Credenciales ingresadas:', { email: this.email, password: this.password });
    
    setTimeout(() => {
      this.router.navigate(['/mfa-verify']);
      this.isLoading = false;
    }, 1000);
  }

  onRecoverySubmit(){
    this.isLoading = true;
    console.log('Solicitanto recuperación para: ', this.recoveryEmail);
    setTimeout(()=>{
      this.isLoading = false;
      alert('Código enviado a tu correo');
      this.showRecovery = false;
    },1500);
  }
}
