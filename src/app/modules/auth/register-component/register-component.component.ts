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

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      console.log("Enviando datos al servidor...", this.registerForm.value); // Log de datos enviados
  
      this.authService.registerUser(this.registerForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          console.log("✅ Registro exitoso - Respuesta del servidor:", response); // Log de éxito
          this.showSuccess('Registro exitoso', 'Usuario registrado correctamente');
          this.registerForm.reset();
          this.registerForm.patchValue({ country: 'Colombia' });
        },
        error: (err) => {
          this.isLoading = false;
          console.error("❌ Error en el registro - Detalles:", err); // Log de error
          this.showError('Error en registro', err.error?.message || 'Ocurrió un error al registrar');
        }
      });
    } else {
      console.warn("⚠ Formulario inválido - Campos faltantes o incorrectos"); // Log de formulario inválido
      this.showWarn('Formulario inválido', 'Por favor complete todos los campos requeridos');
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

  private showWarn(summary: string, detail: string) {
    this.messageService.add({
      severity: 'warn',
      summary,
      detail,
      life: 5000
    });
  }
}
