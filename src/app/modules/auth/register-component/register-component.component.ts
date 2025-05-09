import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { MessageService } from 'primeng/api';

interface SelectOption {
  display: string;
  value: string;
}

@Component({
  selector: 'app-register-component',
  templateUrl: './register-component.component.html',
  styleUrls: ['./register-component.component.css'],
  providers: [MessageService]
})
export class RegisterComponentComponent {
  isLoading = false;

  hidePassword: boolean = true;

  togglePasswordVisibility(): void {
  this.hidePassword = !this.hidePassword;
  }

  employmentStatuses: SelectOption[] = [
    { display: 'Empleado', value: 'employed' },
    { display: 'Desempleado', value: 'unemployed' },
    { display: 'Jubilado', value: 'retired' },
    { display: 'Estudiante', value: 'student' }
  ];

  incomeRanges: SelectOption[] = [
    { display: '$0 - $24.999', value: '0_24999' },
    { display: '$25.000 - $99.999', value: '25000_99999' },
    { display: '$100.000 - $499.999', value: '100000_499999' },
    { display: '$500.000 - $999.999', value: '500000_999999' },
    { display: '$1.000.000+', value: '1000000_plus' }
  ];

  fundingSources: SelectOption[] = [
    { display: 'Rentas del trabajo', value: 'employment_income' },
    { display: 'Rentas empresariales', value: 'business_income' },
    { display: 'Herencias', value: 'inheritance' },
    { display: 'Inversiones', value: 'investments' },
    { display: 'Ahorros', value: 'savings' },
    { display: 'Familia', value: 'family' }
  ];

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
      password: ['', [Validators.required, Validators.minLength(8)]],
      employmentStatus: ['', Validators.required],
      annualIncome: ['', Validators.required],
      netWorth: ['', Validators.required],
      investableAssets: ['', Validators.required],
      fundingSource: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;

      const formData = {
        ...this.registerForm.value,
        annual_income_min: this.getMinValue(this.registerForm.value.annualIncome),
        annual_income_max: this.getMaxValue(this.registerForm.value.annualIncome),
        total_net_worth_min: this.getMinValue(this.registerForm.value.netWorth),
        total_net_worth_max: this.getMaxValue(this.registerForm.value.netWorth),
        liquid_net_worth_min: this.getMinValue(this.registerForm.value.investableAssets),
        liquid_net_worth_max: this.getMaxValue(this.registerForm.value.investableAssets),
        funding_source: this.registerForm.value.fundingSource
      };

      // Usar formData en lugar de this.registerForm.value
      this.authService.registerUser(formData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.showSuccess('Registro exitoso', 'Usuario registrado correctamente');
          this.registerForm.reset();
          this.registerForm.patchValue({ country: 'Colombia' });
        },
        error: (err) => {
          this.isLoading = false;
          this.showError('Error en registro', err.error?.message || 'Ocurrió un error al registrar');
          console.log(this.registerForm.value); // Se corrigió el error de sintaxis
        }
      });
    } else {
      this.showWarn('Formulario inválido', 'Por favor complete todos los campos requeridos');
    }
  }

  private getMinValue(range: string): string {
    const parts = range.split('_');
    return parts[0];
  }

  private getMaxValue(range: string): string {
    const parts = range.split('_');
    return parts[1] === 'plus' ? '10000000' : parts[1];
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
