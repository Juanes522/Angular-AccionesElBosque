import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login-component',
  templateUrl: './login-component.component.html',
  styleUrls: ['./login-component.component.css']
})

export class LoginComponentComponent {
  isLoading: boolean = false;

  loginForm: FormGroup;

  recoveryEmail: string = '';
  showRecovery: boolean = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthServiceService,
    private messageService: MessageService
  ){
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  toggleRecovery(){
    this.showRecovery = !this.showRecovery;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;

      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.showSuccess('Bienvenido', 'Inicio de sesión exitoso');
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.isLoading = false;
          this.showError('Error', err.error?.message || 'Credenciales inválidas');
          this.authService.clearAuth();
        }
      });
    } else {
      this.showError('Formulario inválido', 'Por favor introduzca un correo valido');
    }
  }

  private showSuccess(summary: string, detail: string) {
    this.messageService.add({
      severity: 'success',
      summary,
      detail,
      life: 5000
    });
  }

  private showError(summary: string, detail: string) {
    this.messageService.add({
      severity: 'error',
      summary,
      detail,
      life: 5000
    });
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
