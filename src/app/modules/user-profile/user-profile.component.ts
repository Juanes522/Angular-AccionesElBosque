import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ProfileService } from 'src/app/services/profile.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  selectedTab = 0;
  userData: any = null;
  currentPlan: 'basic' | 'premium' = 'basic';
  premiumOption: 'monthly' | 'annual' | null = null;

  hideCurrentPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;

  passwordForm: FormGroup;
  basicInfoForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private profileService: ProfileService,
    private authService: AuthServiceService
  ) {
    this.basicInfoForm = this.fb.group({
      cardId: [{ value: '', disabled: true }],
      firstName: [{ value: '', disabled: true }],
      lastName: [{ value: '', disabled: true }],
      email: [{ value: '', disabled: true }],
      phone: [{ value: '', disabled: true }]
    });

    this.passwordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      currentPassword: ['', Validators.required],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8)
      ]]
    });
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData() {
    const alpacaId = this.authService.getCurrentAlpacaUserId();

    if (alpacaId) {
      this.profileService.getUserByAlpacaId(alpacaId).subscribe({
        next: (response) => {
          this.userData = response;
          this.basicInfoForm.patchValue(response);
          this.passwordForm.patchValue({ email: response.email });
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo cargar la información del usuario',
            life: 3000
          });
        }
      });
    }
  }

  updatePassword() {
    if (this.passwordForm) {
      const { email, currentPassword, newPassword } = this.passwordForm.value;

      this.profileService.changePassword(email, currentPassword, newPassword).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Contraseña actualizada correctamente',
            life: 3000
          });
          this.passwordForm.reset({
            email: this.userData.email,
            currentPassword: '',
            newPassword: ''
          });
        },
        error: (err) => {

          if (err.status === 200 || err.status === 201) {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Contraseña actualizada correctamente',
              life: 3000
            });
            this.passwordForm.reset({
              email: this.userData.email,
              currentPassword: '',
              newPassword: ''
            });
          } else {
            // Manejar diferentes tipos de errores
            let errorMessage = 'Error al cambiar la contraseña';

            switch (err.status) {
              case 401:
                errorMessage = 'La contraseña actual es incorrecta';
                break;
              case 400:
                errorMessage = 'Datos inválidos. Verifique la información ingresada';
                break;
              case 404:
                errorMessage = 'Usuario no encontrado';
                break;
              case 500:
                errorMessage = 'Error interno del servidor. Intente más tarde';
                break;
              case 0:
                errorMessage = 'Error de conexión. Verifique su conexión a internet';
                break;
              default:
                errorMessage = `Error al cambiar la contraseña (${err.status})`;
            }

            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: errorMessage,
              life: 3000
            });
          }
        }
      });
    }
  }

  changePlan(plan: 'basic' | 'premium') {
    if (plan === 'premium' && !this.premiumOption) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Selección requerida',
        detail: 'Por favor selecciona una opción de pago',
        life: 3000
      });
      return;
    }

    this.profileService.updatePlan(plan, this.premiumOption || undefined)
      .subscribe({
        next: () => {
          this.currentPlan = plan;
          this.messageService.add({
            severity: 'success',
            summary: 'Plan actualizado',
            detail: `Ahora tienes el plan ${plan === 'basic' ? 'Básico' : 'Premium'}`,
            life: 3000
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo cambiar el plan',
            life: 3000
          });
        }
      });
  }

}
