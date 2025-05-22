import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  selectedTab = 0;
  currentPlan: 'basic' | 'premium' = 'basic';
  premiumOption: 'monthly' | 'annual' | null = null;

  hideCurrentPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;

  basicInfoForm: FormGroup;
  financialProfileForm: FormGroup;
  passwordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private profileService: ProfileService
  ) {
    this.basicInfoForm = this.fb.group({
      accountNumber: [{ value: '', disabled: true }],
      email: ['', [Validators.required, Validators.email]]
    });

    this.financialProfileForm = this.fb.group({
      annualIncome: ['', Validators.required],
      netWorth: ['', Validators.required],
      investableAssets: ['', Validators.required],
      fundingSource: ['', Validators.required]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/)
      ]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.checkPasswords });
  }

  ngOnInit(): void {
    this.profileService.getUserData().subscribe(userData => {
      this.basicInfoForm.patchValue({
        accountNumber: userData.accountNumber,
        email: userData.email
      });

      if (userData.financialProfile) {
        this.financialProfileForm.patchValue(userData.financialProfile);
      }

      this.currentPlan = (userData.plan as 'basic' | 'premium') || 'basic';
    });
  }

  checkPasswords(group: FormGroup) {
    const pass = group.get('newPassword')?.value;
    const confirmPass = group.get('confirmPassword')?.value;
    return pass === confirmPass ? null : { notSame: true };
  }

  saveFinancialProfile() {
    if (this.financialProfileForm.valid) {
      this.profileService.updateFinancialProfile(this.financialProfileForm.value)
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Perfil financiero actualizado',
              life: 3000
            });
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo actualizar el perfil financiero',
              life: 3000
            });
          }
        });
    }
  }

  updatePassword() {
    if (this.passwordForm.valid) {
      const { currentPassword, newPassword } = this.passwordForm.value;
      this.profileService.updatePassword(currentPassword, newPassword)
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Contraseña actualizada correctamente',
              life: 3000
            });
            this.passwordForm.reset();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo actualizar la contraseña',
              life: 3000
            });
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
