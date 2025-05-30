import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AchService } from 'src/app/services/ach.service';
import { MessageService } from 'primeng/api';
import { AuthServiceService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-fund-account',
  templateUrl: './fund-account.component.html',
  styleUrls: ['./fund-account.component.css']
})
export class FundAccountComponent implements OnInit {
  accountId: string = '';

  step: number = 1; // 1: Crear relación, 2: Hacer transferencia
  relationshipId: string | null = null;

  relationshipForm: FormGroup = this.fb.group({
    account_owner_name: ['', [Validators.required, Validators.maxLength(100)]],
    bank_account_type: ['CHECKING', [Validators.required]],
    bank_account_number: ['', [Validators.required, Validators.pattern(/^[0-9a-zA-Z]+$/)]],
    bank_routing_number: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
    nickname: ['', [Validators.required, Validators.maxLength(50)]]
  });

  transferForm: FormGroup = this.fb.group({
    amount: ['', [Validators.required, Validators.min(1), Validators.max(50000)]],
    direction: ['INCOMING', [Validators.required]]
  });

  constructor(
    private fb: FormBuilder,
    private achService: AchService,
    private messageService: MessageService,
    private authService: AuthServiceService
  ) { }

  ngOnInit() {
    this.accountId = this.authService.getCurrentAlpacaUserId() || '';
    if (this.accountId) {
      this.checkExistingRelationship();
    } else {
      console.warn('No se encontró accountId (alpacaUserId) en el AuthService');
    }
  }

/**
 * Valida un número de ruta bancaria (ABA Routing Number) usando el algoritmo de checksum MOD 10.
 * @param routingNumber Número de ruta de 9 dígitos (como string o número).
 * @returns boolean - True si es válido, False si no.
 */
isValidRoutingNumber(routingNumber: string | number): boolean {
  // Convertir a string y eliminar espacios/no-dígitos
  const routingStr = routingNumber.toString().replace(/\D/g, '');

  // Verificar longitud (debe ser 9 dígitos)
  if (routingStr.length !== 9) {
    return false;
  }

  // Algoritmo de checksum (MOD 10)
  const digits = routingStr.split('').map(Number);
  const weights = [3, 7, 1, 3, 7, 1, 3, 7, 1]; // Pesos para cada dígito
  let sum = 0;

  for (let i = 0; i < digits.length; i++) {
    sum += digits[i] * weights[i];
  }

  // El checksum es válido si la suma es múltiplo de 10
  return sum % 10 === 0;
}


// verificar la relacion ach
checkExistingRelationship() {
    this.achService.getAchRelationshipsId(this.accountId).subscribe({
      next: (relationshipIds: string[]) => {
        if (relationshipIds && relationshipIds.length > 0) {
          this.relationshipId = relationshipIds[0]; // Tomamos el primer ID
          this.step = 2; // Mostrar directamente el formulario de transferencia
        }
      },
      error: (err) => {
        console.error('Error al verificar relación existente:', err);
      }
    });
}
  


createRelationship() {
  if (this.relationshipForm.valid) {
    const routingNumber = this.relationshipForm.get('bank_routing_number')?.value;

    // Validar el routing number
    if (!this.isValidRoutingNumber(routingNumber)) {
      this.showError(
        'Número de ruta inválido',
        'El número de ruta bancaria no pasó la validación. Verifica los dígitos.'
      );
      return; // Detener el proceso si no es válido
    }

    const requestBody = this.relationshipForm.value;
    this.achService.createAchRelationship(this.accountId, requestBody).subscribe({
      next: (response: any) => {
        this.relationshipId = response.id;
        this.step = 2;
        this.showSuccess('Éxito', 'Relación bancaria creada correctamente');
      },
      error: (err) => {
        this.showError('Error', err.error?.message || 'Error al crear la relación');
      }
    });
  } else {
    this.showError('Formulario inválido', 'Por favor completa todos los campos requeridos');
  }
}

  // Crear transferencia ACH
  createTransfer() {
    if (this.transferForm.valid && this.relationshipId) {

      const transferData = {
        transfer_type: 'ach',
        relationship_id: this.relationshipId,
        amount: this.transferForm.value.amount.toString(),
        direction: this.transferForm.value.direction
      };

      this.achService.createAchTransfer(this.accountId, transferData).subscribe({
        next: (response) => {
          this.showSuccess('Éxito', 'Transferencia realizada correctamente');
          this.resetForms();
        },
        error: (err) => {
          this.showError('Error', err.error?.message || 'Error al realizar la transferencia');
        }
      });
    } else {
      this.showError('Error', 'Complete todos los campos requeridos');
    }
  }

  resetForms() {
    this.step = 2;
    this.relationshipForm.reset({
      bank_account_type: 'CHECKING'
    });
    this.transferForm.reset({
      direction: 'INCOMING'
    });
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
}
