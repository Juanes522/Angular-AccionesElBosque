import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-mfa-verification',
  templateUrl: './mfa-verification.component.html',
  styleUrls: ['./mfa-verification.component.css']
})
export class MfaVerificationComponent {
  mfaCode: string[] = Array(6).fill('');

  constructor(
    //private authService: AuthServiceService,
    private router: Router
  ){}

  onInputChange(event: any, index: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    
    if (/^\d*$/.test(value)) {
      this.mfaCode[index] = value;
      
      if (value && index < 5) {
        const nextInput = document.querySelector(`input[name=mfa-${index + 1}]`) as HTMLInputElement;
        nextInput.focus();
      }
    } else {
      input.value = '';
      this.mfaCode[index] = '';
    }
  }

  onKeyDown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace' && !this.mfaCode[index] && index > 0) {
      const prevInput = document.querySelector(`input[name=mfa-${index - 1}]`) as HTMLInputElement;
      prevInput.focus();
    }
  }

  verifyCode() {
    if(this.mfaCode.some(digit => !digit)){
      alert('Por favor completa todos los digitos');
      return;
    }
    const code = this.mfaCode.join('');
    console.log('Código MFA ingresado:', code);
    
    setTimeout(() => {
      alert('¡Verificación MFA exitosa!');
      this.router.navigate(['/dashboard']);
    }, 1000);
  }
/*
  resendCode(): void {
    this.authService.resendMFA().subscribe({
      next: () => alert('Nuevo código enviado.'),
      error: () => alert('Error al reenviar el código.')
    });
  }
    */
}
