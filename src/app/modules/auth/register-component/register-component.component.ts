import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-register-component',
  templateUrl: './register-component.component.html',
  styleUrls: ['./register-component.component.css'],
  providers: [MessageService]
})
export class RegisterComponentComponent {
  isLoading = false;
  
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthServiceService,
    private messageService: MessageService
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      birthDate: ['', Validators.required],
      country: ['Colombia', Validators.required],
      city: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      postalCode: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onSubmit(){

    if (this.registerForm.valid) {
      this.authService.registerUser(this.registerForm.value).subscribe({
        next: (response) => {
          this.showSuccess('Registro exitoso', 'Usuario registrado correctamente');
          this.registerForm.reset();
          this.registerForm.patchValue({ country: 'Colombia' });
        },
        error: (err) => {
          this.showError('Error en registro', err.error?.message || 'Ocurrió un error al registrar');
        }
      });
    } else {
      this.showWarn('Formulario inválido', 'Por favor complete todos los campos requeridos');
    }

    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      alert('Registro exitoso');
    }, 1500);
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

  private showWarn(summary: string, detail: string) {
    this.messageService.add({
      severity: 'warn',
      summary,
      detail,
      life: 5000
    });
  }
}
